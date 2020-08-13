package com.practice.theater.db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Decorator implementation
 * @see ConnectionDecorator
 */
public class PooledConnection extends ConnectionDecorator {

    private final ConnectionPool ownerPool;

    public PooledConnection(Connection connection, ConnectionPool pool) {
        super(connection);
        ownerPool = pool;
    }

    @Override
    public void close() throws SQLException {
        close(false);
    }

    /**
     * Close connection or gives to pool
     * @param forever - if false gives to pool, otherwise close connection
     * @throws SQLException default
     */
    public void close(boolean forever) throws SQLException {
        if (forever) {
            super.close();
        } else {
            ownerPool.putConnection(this);
        }
    }
}

