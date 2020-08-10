package com.practice.business.repository.jdbc;

import com.practice.business.ServiceLocator;
import com.practice.business.db.annotations.*;
import com.practice.business.db.exceptions.DatabaseException;
import com.practice.business.db.exceptions.ForeignKeyException;
import com.practice.business.db.exceptions.MappingValueException;
import com.practice.business.db.jdbc.StatementBuilder;
import com.practice.business.repository.InvalidMethodException;
import com.practice.business.repository.Repository;
import com.sun.xml.internal.ws.util.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.*;
import java.util.Date;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

public abstract class GenericJdbcRepository <K extends Serializable, T> implements Repository<K, T> {

    private static final Logger LOGGER = LogManager.getLogger(GenericJdbcRepository.class);

    /**
     * Class associated with the table
     */
    private final Class<T> classInstance;

    /**
     * Name of database table associating with {@link #classInstance}
     */
    private String tableName;

    /**
     * Field associated with table primary key
     */
    private Field primaryKey;

    /**
     * Cached data for fields of class and associating {@link Column} annotation.
     * The order of elements is important for statements generator.
     * ***********************************************************
     * Maps filled in once and they are immutable, for save order
     */
    private final Map<Field, Column> fieldsCache = new HashMap<>();
    private final Map<Field, Method> getterCache = new HashMap<>();
    private final Map<Field, Method> setterCache = new HashMap<>();

    public GenericJdbcRepository(Class<T> cl) {
        this.classInstance = cl;
        cacheMetaInfo();
    }

    public String getFieldTableName(String name) {
        for (Map.Entry<Field, Column> entry : fieldsCache.entrySet()) {
            if (entry.getKey().getName().equals(name)) {
                return entry.getValue().name();
            }
        }
        return null;
    }

    protected void executeAsTransaction(GenericJdbcRepository.Executor executor) {
        try (Connection connection = ServiceLocator.getInstance().getConnectionFactory().openConnection()) {
            transaction(executor, connection);
        } catch (SQLException e) {
            LOGGER.error(e);
        }
    }

    private void transaction(Executor executor, Connection connection) throws SQLException {
        try {
            connection.setAutoCommit(false);
            executor.execute(connection);
            connection.commit();
        } catch (SQLException e) {
            connection.rollback();
            LOGGER.error(e);
        }
    }

    @SafeVarargs
    protected final <S extends T> void saveInstance(S... instances) {
        executeAsTransaction(connection -> {
            String st = StatementBuilder.getInstance().insertStatement(tableName, fieldsCache, instances.length);
            try (PreparedStatement statement = connection.prepareStatement(st, Statement.RETURN_GENERATED_KEYS)) {
                int index = 1;
                for (S instance : instances) {
                    for (Field key : fieldsCache.keySet()) {
                        index = resolveMapping(statement, index, instance, key);
                    }
                }
                int c = statement.executeUpdate();
                if (c > 0 && primaryKey != null) {
                    try(ResultSet generatedKey = statement.getGeneratedKeys()) {
                        for (S instance : instances) {
                            generatedKey.next();
                            invokeSetter(primaryKey, instance, generatedKey.getObject(1, primaryKey.getType()));
                        }
                    }
                }
            }
        });
    }

    private <S extends T> int resolveMapping(PreparedStatement statement, int startIndex, S instance, Field key) throws SQLException {
        int index = startIndex;
        if (key.isAnnotationPresent(Mapper.class)) {
            excludePrimaryKey(key);
            statement.setObject(index++, convertInstanceFieldFrom(key, invokeGetter(key, instance)));
        } else if (key.isAnnotationPresent(Constraint.class)) {
            excludePrimaryKey(key);
            statement.setObject(index++, constraintValue(key, instance));
        } else {
            statement.setObject(index++, invokeGetter(key, instance));
        }
        return index;
    }

    private void excludePrimaryKey(Field key) {
        if (primaryKey == key) {
            throw new MappingValueException(key);
        }
    }

    private <S extends T> Object constraintValue(Field field, S instance) {
        try {
            Object constraint = invokeGetter(field, instance);
            if (!constraint.getClass().isAnnotationPresent(Table.class)) {
                throw new ForeignKeyException("Isn't annotated with table - " + constraint.getClass());
            }
            Field ref = constraint.getClass().getField(field.getAnnotation(Constraint.class).mappedBy());
            return invokeGetter(ref, constraint);
        } catch (NoSuchFieldException e) {
            throw new ForeignKeyException("Constraint error, field not found - " + field);
        }
    }

    protected boolean updateInstance(T instance) {
        final String statement = StatementBuilder.getInstance().updateStatement(tableName, fieldsCache);
        AtomicBoolean result = new AtomicBoolean(false);
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                int index = 1;
                for (Map.Entry<Field, Column> entry : fieldsCache.entrySet()) {
                    if (!entry.getValue().isPrimaryKey()) {
                        index = resolveMapping(st, index, instance, entry.getKey());
                    }
                }
                st.setObject(index, invokeGetter(primaryKey, instance));
                result.set(st.executeUpdate() > 0);
            }
        });
        return result.get();
    }

    protected boolean isExistsByPrimaryKey(K keyValue) {
        AtomicBoolean exists = new AtomicBoolean(false);
        executeAsTransaction(connection -> {
            String st = StatementBuilder.getInstance().checkExistsStatement(tableName, fieldsCache.get(primaryKey).name());
            try (PreparedStatement statement = connection.prepareStatement(st)) {
                statement.setObject(1, keyValue);
                ResultSet set = statement.executeQuery();
                if (set.next()) {
                    exists.set(true);
                }
            }
        });
        return exists.get();
    }

    protected List<T> findAllInstances() {
        final String statement = StatementBuilder.getInstance().getAllStatement(tableName);
        List<T> resultSet = new ArrayList<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                try (ResultSet set = st.executeQuery()) {
                    while (set.next()) {
                        resultSet.add(ejectInstance(classInstance, set, null));
                    }
                }
            }
        });
        return resultSet;
    }

    protected List<T> findByKeyInstances(String key, Object keyVal, @Nullable Object constraint) {
        final String statement = StatementBuilder.getInstance().getRowsByKeyStatement(tableName, key);
        List<T> resultSet = new ArrayList<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                st.setObject(1, keyVal);
                try (ResultSet set = st.executeQuery()) {
                    while (set.next()) {
                        resultSet.add(ejectInstance(classInstance, set, constraint));
                    }
                }
            }
        });
        return resultSet;
    }

    protected T findByPrimaryKeyInstances(Object keyVal) {
        List<T> instances = findByKeyInstances(fieldsCache.get(primaryKey).name(), keyVal, null);
        return instances.isEmpty() ? null : instances.get(0);
    }

    protected void deleteByPrimaryKey(Object keyValue) {
        executeAsTransaction(connection -> {
            String st= StatementBuilder.getInstance().deleteByKeyStatement(tableName, fieldsCache.get(primaryKey).name());
            try (PreparedStatement statement = connection.prepareStatement(st)) {
                statement.setObject(1, keyValue);
                int ct = statement.executeUpdate();
                if (ct == 0) {
                    throw new SQLException("cannot delete instance " + tableName);
                }
            }
        });
    }

    protected void deleteByPrimaryKeyInstance(T model) {
        deleteByPrimaryKey(invokeGetter(primaryKey, model));
    }

    @Override
    public long count() {
        AtomicLong result = new AtomicLong(0);
        executeAsTransaction(connection -> {
            try (PreparedStatement statement = connection.prepareStatement(StatementBuilder.getInstance().countRowsStatement(tableName))) {
                ResultSet resultSet = statement.executeQuery();
                if (resultSet.next()) {
                    result.set(resultSet.getLong(1));
                }
            }
        });
        return result.get();
    }

    private Object convertInstanceField(Field field, Object value, String methodName) {
        try {
            Mapper mapper = field.getAnnotation(Mapper.class);
            @SuppressWarnings("rawtypes")
            Converter converter = mapper.converter().getDeclaredConstructor().newInstance();
            Method method = mapper.converter().getMethod(methodName, value.getClass());
            return method.invoke(converter, value);
        } catch (InstantiationException | NoSuchMethodException |
                InvocationTargetException | IllegalAccessException e) {
            LOGGER.error(e);
        }
        return null;
    }

    private Object convertInstanceFieldFrom(Field field, Object value) {
        return convertInstanceField(field, value, "convertFrom");
    }

    private Object convertInstanceFieldTo(Field field, Object value) {
        return convertInstanceField(field, value, "convertTo");
    }

    private <E> E ejectInstance(Class<E> cl, ResultSet set, @Nullable Object constraint) throws SQLException {
        try {
            E entity = cl.getDeclaredConstructor().newInstance();
            for (Map.Entry<Field, Column> entry : fieldsCache.entrySet()) {
                Object sqlObject = set.getObject(entry.getValue().name());
                if (entry.getKey().isAnnotationPresent(Mapper.class)) {
                    excludePrimaryKey(entry.getKey());
                    invokeSetter(entry.getKey(), entity, convertInstanceFieldTo(entry.getKey(), sqlObject));
                } else if (entry.getKey().isAnnotationPresent(Constraint.class)) {
                    invokeSetter(entry.getKey(), entity, createConstraint(entity, entry.getKey(), sqlObject, constraint));
                } else {
                    if (sqlObject instanceof java.util.Date) {
                        sqlObject = ((Date) sqlObject).toInstant();
                    }
                    invokeSetter(entry.getKey(), entity, sqlObject);
                }
            }
            return entity;
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            throw new InvalidMethodException(e);
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private Object createConstraint(Object instance, Field field, Object ref, @Nullable Object constraint) {
        Class<?> type = field.getType();
        String fieldConstraintName = field.getAnnotation(Constraint.class).mappedBy();
        if (constraint != null && type.equals(constraint.getClass())) {
            return constraint;
        }
        JdbcRepository repository = new JdbcRepository(type) {};
        List result = repository.findByKeyInstances(fieldConstraintName, ref, instance);
        if (!result.isEmpty()) {
            return result.get(0);
        }
        throw new ForeignKeyException("Constraint error " + field.getName() + " for " + classInstance);
    }

    private void cacheMetaInfo() {
        Table table = Objects.requireNonNull(classInstance.getAnnotation(Table.class), "Entity must be annotated with @Table");
        Field[] fields = classInstance.getDeclaredFields();

        tableName = table.name();
        Column column;
        for (Field field : fields) {
            column = field.getAnnotation(Column.class);
            if (column != null) {
                fieldsCache.put(field, column);
                if (column.isPrimaryKey()) {
                    if (primaryKey != null) {
                        throw new DatabaseException("More than one primary key " + tableName);
                    }
                    primaryKey = field;
                }
            }
        }
    }

    private Object invokeGetter(Field field, Object instance) {
        Method getter = getterCache.computeIfAbsent(field, f ->
                getBeanMethod(f, "get", f.getType()));
        try {
            return getter.invoke(instance);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new InvalidMethodException(e);
        }
    }

    private void invokeSetter(Field field, Object instance, Object value) {
        Method setter = setterCache.computeIfAbsent(field, f ->
                getBeanMethod(f, "set", null, f.getType()));
        try {
            setter.invoke(instance, value);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new InvalidMethodException("Error - " + instance.getClass(), e);
        }
    }

    @NotNull
    private Method getBeanMethod(Field field, String prefix, @Nullable Class<?> returnType, Class<?> ... params) {
        try {
            Method method = classInstance.getMethod(prefix + StringUtils.capitalize(field.getName()), params);
            if (returnType != null && !returnType.isAssignableFrom(method.getReturnType())) {
                throw new InvalidMethodException("Method invalid return type for field " + field.getName());
            }
            return method;
        } catch (NoSuchMethodException e) {
            throw new InvalidMethodException(e);
        }
    }

    public interface Executor {
        void execute(Connection connection) throws SQLException;
    }
}
