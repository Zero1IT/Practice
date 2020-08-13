package com.practice.theater.db;

import com.practice.theater.db.annotations.Column;

import java.lang.reflect.Field;
import java.util.Map;

public interface StatementCreator {
    String insertStatement(String tableName, Map<Field, Column> fieldsMap, int count);
    String deleteByKeyStatement(String table, String keyName);
    String checkExistsStatement(String table, String keyName);
    String getRowsByKeyStatement(String table, String keyName);
    String getAllStatement(String table);
    String updateStatement(String tableName, Map<Field, Column> fieldsMap);
    String countRowsStatement(String tableName);
}
