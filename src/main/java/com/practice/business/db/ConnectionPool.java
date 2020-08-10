package com.practice.business.db;

import java.sql.Connection;
import java.sql.SQLException;

public interface ConnectionPool {
    /**
     * @return pool max size
     */
    int size();

    /**
     * Method gives connection from pool
     * @return pooled connection
     * @throws SQLException from driver manager
     */
    Connection getConnection() throws SQLException;

    /**
     * Method gives connection to pool
     * @param connection conn from current pool
     */
    void putConnection(PooledConnection connection);
}

