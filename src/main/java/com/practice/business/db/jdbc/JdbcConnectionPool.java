package com.practice.business.db.jdbc;

import com.practice.business.db.ConnectionPool;
import com.practice.business.db.PooledConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcConnectionPool implements ConnectionPool {

    private static final Logger LOGGER = LogManager.getLogger(JdbcConnectionPool.class);
    private static final int DEFAULT_POOL_SIZE = 10;
    private final Object lock = new Object();
    private int poolSize;
    private String connectionString;
    private final List<PooledConnection> connections;

    private JdbcConnectionPool() {
        this(DEFAULT_POOL_SIZE);
    }

    private JdbcConnectionPool(int size) {
        connections = new ArrayList<>(size);
        poolSize = size;
    }

    @Override
    public int size() {
        return poolSize;
    }

    @Override
    public Connection getConnection() throws SQLException {
        synchronized (lock) {
            for (int i = connections.size() - 1; i >= 0; i--) {
                if (!connections.get(i).isClosed()) {
                    return connections.remove(i);
                } else {
                    connections.remove(i);
                }
            }

            return new PooledConnection(DriverManager.getConnection(connectionString), this);
        }
    }

    @Override
    public void putConnection(PooledConnection connection) {
        synchronized (lock) {
            try {
                if (!connection.isClosed()) {
                    connections.add(connection);
                }
            } catch (SQLException e) {
                LOGGER.error(e);
            }
        }
    }

    @Override
    protected void finalize() throws Throwable {
        for (PooledConnection connection : connections) {
            connection.close(true);
        }

        super.finalize();
    }

    public static class Builder {

        private final JdbcConnectionPool pool = new JdbcConnectionPool();
        private boolean poolSizeIsSet;

        public Builder setUrl(String connectionString) {
            pool.connectionString = connectionString;
            return this;
        }

        public Builder defaultPoolSize() {
            return setPoolSize(DEFAULT_POOL_SIZE);
        }

        public Builder setPoolSize(int size) {
            pool.poolSize = size;
            poolSizeIsSet = true;
            return this;
        }

        public JdbcConnectionPool build() {
            if (!poolSizeIsSet) {
                defaultPoolSize();
            }
            if (pool.connectionString != null && !pool.connectionString.isEmpty()) {
                return pool;
            } else {
                throw new RuntimeException("Connection string not found");
            }
        }
    }
}

