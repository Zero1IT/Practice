package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.Utils;
import com.practice.theater.db.annotations.*;
import com.practice.theater.db.exceptions.DatabaseException;
import com.practice.theater.db.exceptions.ForeignKeyException;
import com.practice.theater.db.exceptions.MappingValueException;
import com.practice.theater.db.jdbc.StatementBuilder;
import com.practice.theater.repository.InvalidMethodException;
import com.practice.theater.repository.Repository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
            throw new DatabaseException(e);
        }
    }

    private static void transaction(Executor executor, Connection connection) throws SQLException {
        try {
            connection.setAutoCommit(false);
            executor.execute(connection);
            connection.commit();
        } catch (SQLException e) {
            connection.rollback();
            LOGGER.error(e);
            throw new DatabaseException(e);
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
            Object o = invokeGetter(key, instance);
            if (o instanceof Instant) {
                statement.setObject(index++, LocalDateTime.ofInstant(((Instant) o), ZoneId.systemDefault()));
            } else {
                statement.setObject(index++, o);
            }
        }
        return index;
    }

    private void excludePrimaryKey(Field key) {
        if (primaryKey == key) { // NOSONAR
            throw new MappingValueException(key);
        }
    }

    private <S extends T> Object constraintValue(Field field, S instance) {
        try {
            Object constraint = invokeGetter(field, instance);
            if (constraint == null) {
                return null;
            }
            if (!constraint.getClass().isAnnotationPresent(Table.class)) {
                throw new ForeignKeyException("Isn't annotated with table - " + constraint.getClass());
            }
            Field ref = constraint.getClass().getDeclaredField(field.getAnnotation(Constraint.class).mappedBy());
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
        return readInstancesByStatement(StatementBuilder.getInstance().getAllStatement(tableName));
    }

    protected List<T> paginationSelect(long limit, long offset) {
        return readInstancesByStatement(StatementBuilder.getInstance()
                .paginationStatement(tableName, fieldsCache.get(primaryKey).name(), limit, offset));
    }

    protected List<T> paginationConditionSelect(String key, Object keyVal, long limit, long offset) {
        return readPaginationByStatement(StatementBuilder.getInstance().paginationConditionStatement(
                tableName, fieldsCache.get(primaryKey).name(), limit, offset, key), keyVal);
    }

    @NotNull
    private List<T> readPaginationByStatement(String statement, Object val) {
        List<T> resultSet = new ArrayList<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                st.setObject(1, val);
                ejectListInstances(resultSet, st);
            }
        });
        return resultSet;
    }

    @NotNull
    private List<T> readInstancesByStatement(String statement) {
        List<T> resultSet = new ArrayList<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                ejectListInstances(resultSet, st);
            }
        });
        return resultSet;
    }

    private void ejectListInstances(List<T> resultSet, PreparedStatement st) throws SQLException {
        try (ResultSet set = st.executeQuery()) {
            while (set.next()) {
                resultSet.add(ejectInstance(set));
            }
        }
    }

    protected List<T> findByKeyInstances(String key, Object keyVal, Object ... constraints) {
        final String statement = StatementBuilder.getInstance().getRowsByKeyStatement(tableName, key);
        List<T> resultSet = new ArrayList<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement st = connection.prepareStatement(statement)) {
                st.setObject(1, keyVal);
                try (ResultSet set = st.executeQuery()) {
                    while (set.next()) {
                        resultSet.add(ejectInstance(set, constraints));
                    }
                }
            }
        });
        return resultSet;
    }

    protected T findByPrimaryKeyInstances(Object keyVal) {
        List<T> instances = findByKeyInstances(fieldsCache.get(primaryKey).name(), keyVal);
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
        return calculateCount(StatementBuilder.getInstance().countRowsStatement(tableName), null);
    }

    public long countCondition(String columnName, Object val) {
        return calculateCount(StatementBuilder.getInstance().countRowsWithConditionStatement(tableName, columnName), stm -> {
                    stm.setObject(1, val);
                    return stm;
                });
    }

    public long calculateCount(String stm, PreparedStatementSetter setter) {
        AtomicLong result = new AtomicLong(0);
        executeAsTransaction(connection -> {
            try (PreparedStatement statement = connection.prepareStatement(stm)) {
                if (setter != null) {
                    setter.apply(statement);
                }
                ResultSet resultSet = statement.executeQuery();
                if (resultSet.next()) {
                    result.set(resultSet.getLong(1));
                }
            }
        });
        return result.get();
    }

    private static Object convertInstanceField(Field field, Object value, String methodName) {
        try {
            Mapper mapper = field.getAnnotation(Mapper.class);
            @SuppressWarnings("rawtypes")
            Converter converter = mapper.converter().getDeclaredConstructor().newInstance(); // NOSONAR
            Method method = mapper.converter().getMethod(methodName, value.getClass());
            return method.invoke(converter, value);
        } catch (InstantiationException | NoSuchMethodException |
                InvocationTargetException | IllegalAccessException e) {
            LOGGER.error(e);
        }
        return null;
    }

    private static Object convertInstanceFieldFrom(Field field, Object value) {
        return convertInstanceField(field, value, "convertFrom");
    }

    private static Object convertInstanceFieldTo(Field field, Object value) {
        return convertInstanceField(field, value, "convertTo");
    }

    protected T ejectInstance(ResultSet set, Object ... constraints) throws SQLException {
        try {
            T entity = classInstance.getDeclaredConstructor().newInstance();
            for (Map.Entry<Field, Column> entry : fieldsCache.entrySet()) {
                Object sqlObject = set.getObject(entry.getValue().name());
                if (entry.getKey().isAnnotationPresent(Mapper.class)) {
                    excludePrimaryKey(entry.getKey());
                    invokeSetter(entry.getKey(), entity, convertInstanceFieldTo(entry.getKey(), sqlObject));
                } else if (entry.getKey().isAnnotationPresent(Constraint.class)) {
                    invokeSetter(entry.getKey(), entity, createConstraint(entity, entry.getKey(), sqlObject, constraints));
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
    private Object createConstraint(Object instance, Field field, Object ref, Object ... constraints) {
        if (ref == null) {
            return null;
        }
        Class<?> type = field.getType();
        String fieldConstraintName = field.getAnnotation(Constraint.class).mappedBy();
        if (constraints.length != 0) {
            Field[] temp = new Field[1];
            Optional<Object> first = Arrays.stream(constraints)
                    .filter(constraint -> constraint.getClass().equals(type)
                            && (temp[0] = getConstraintObjectField(fieldConstraintName, constraint)) != null
                            && invokeGetter(temp[0], constraint).equals(ref))
                    .findFirst();
            if (first.isPresent()) {
                return first.get();
            }
        }
        JdbcRepository repository = new JdbcRepository(type) {}; // NOSONAR
        List result = repository.findByKeyInstances(fieldConstraintName, ref, instance); // NOSONAR
        if (!result.isEmpty()) {
            return result.get(0);
        }
        throw new ForeignKeyException("Constraint error " + field.getName() + " for " + classInstance);
    }

    private static Field getConstraintObjectField(String fieldConstraintName, Object constraint) {
        try {
            return constraint.getClass().getDeclaredField(fieldConstraintName);
        } catch (NoSuchFieldException e) {
            LOGGER.error(e);
            return null;
        }
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
        try {
            Class<?> cl = instance.getClass();
            String prefix = field.getType().equals(Boolean.TYPE) ? "is" : "get";
            Method getter = getterCache.computeIfAbsent(field, f ->
                    getBeanMethod(cl, f, prefix, f.getType()));
            return getter.invoke(instance);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new InvalidMethodException(e);
        }
    }

    private void invokeSetter(Field field, Object instance, Object value) {
        try {
            Class<?> cl = instance.getClass();
            Method setter = setterCache.computeIfAbsent(field, f ->
                    getBeanMethod(cl, f, "set", null, f.getType()));
            setter.invoke(instance, value);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new InvalidMethodException("Error - " + instance.getClass(), e);
        }
    }

    @NotNull
    private static Method getBeanMethod(Class<?> cl, Field field, String prefix, @Nullable Class<?> returnType, Class<?> ... params) {
        try {
            Method method = cl.getMethod(prefix + Utils.capitalize(field.getName()), params);
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

    public interface PreparedStatementSetter {
        PreparedStatement apply(PreparedStatement stm) throws SQLException;
    }
}
