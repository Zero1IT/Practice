package com.practice.theater.db.jdbc;

import com.practice.theater.db.ConnectionFactory;
import com.practice.theater.db.ConnectionPool;

import java.sql.Connection;
import java.sql.SQLException;

public class JdbcPooledConnectionFactory extends ConnectionFactory {

    private final ConnectionPool connectionPool;

    public JdbcPooledConnectionFactory(String url) {
        connectionPool = new JdbcConnectionPool.Builder()
                .setUrl(url)
                .defaultPoolSize()
                .build();
    }

    @Override
    public Connection openConnection() throws SQLException {
        return connectionPool.getConnection();
    }
}
