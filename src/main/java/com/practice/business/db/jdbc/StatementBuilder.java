package com.practice.business.db.jdbc;

import com.practice.business.db.StatementCreator;
import com.practice.business.db.annotations.Column;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Map;

public class StatementBuilder implements StatementCreator {

    private static final Logger LOGGER = LogManager.getLogger(StatementBuilder.class);
    private static StatementCreator helper;

    public static StatementCreator getInstance() {
        if (helper == null) {
            synchronized (StatementBuilder.class) {
                StatementCreator temp = helper;
                if (temp == null) {
                    temp = (StatementCreator) Proxy.newProxyInstance(
                            StatementBuilder.class.getClassLoader(),
                            new Class[]{StatementCreator.class},
                            new StatementHelperProxy(new StatementBuilder())
                    );
                    helper = temp;
                }
            }
        }
        return helper;
    }

    private StatementBuilder() {}

    @Override
    public String insertStatement(String tableName, Map<Field, Column> fieldsMap, int count) {
        StringBuilder builder = new StringBuilder();
        builder.append(String.format("insert into %s(", tableName));
        int index = 0;
        for (Map.Entry<Field, Column> entry : fieldsMap.entrySet()) {
            builder.append(entry.getValue().name());
            index++;
            if (index < fieldsMap.size()) {
                builder.append(",");
            }
        }
        builder.append(") values ");
        for (int i = 0; i < count; i++) {
            builder.append("(");
            for (int j = 0; j < fieldsMap.size() - 1; j++) {
                builder.append("?,");
            }
            builder.append("?),\n");
        }
        builder.replace(builder.length() - 2, builder.length(), ";");
        return builder.toString();
    }

    @Override
    public String updateStatement(String tableName, Map<Field, Column> fieldsMap) {
        StringBuilder builder = new StringBuilder();
        String primaryKeyName = null;
        builder.append(String.format("update %s set ", tableName));
        int index = 0;
        for (Map.Entry<Field, Column> entry : fieldsMap.entrySet()) {
            index++;
            if (entry.getValue().isPrimaryKey()) {
                primaryKeyName = entry.getValue().name();
            } else {
                builder.append(entry.getValue().name());
                if (index < fieldsMap.size()) {
                    builder.append("=?, ");
                }
            }
        }
        builder.append("=? where ").append(primaryKeyName).append("= ?;");
        return builder.toString();
    }

    @Override
    public String deleteByKeyStatement(String table, String keyName) {
        return "delete from " + table + " where " + keyName + "=?;";
    }

    @Override
    public String checkExistsStatement(String table, String keyName) {
        return "select true from " + table + " where " + keyName + "=?;";
    }

    @Override
    public String getRowsByKeyStatement(String table, String keyName) {
        return "select * from " + table + " where " + keyName + "=?;";
    }

    @Override
    public String getAllStatement(String table) {
        return "select * from " + table;
    }

    @Override
    public String countRowsStatement(String tableName) {
        return "SELECT COUNT(*) FROM " + tableName;
    }

    public static class StatementHelperProxy implements InvocationHandler {
        private final StatementCreator creator;

        public StatementHelperProxy(StatementCreator creator) {
            this.creator = creator;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            Object result = method.invoke(creator, args);
            LOGGER.debug(result);
            return result;
        }
    }
}
