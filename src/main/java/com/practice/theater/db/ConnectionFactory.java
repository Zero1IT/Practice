package com.practice.theater.db;

import com.practice.theater.db.jdbc.JdbcPooledConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;

public abstract class ConnectionFactory {

    public static ConnectionFactory getPooledConnectionFactory(String url) {
        return new JdbcPooledConnectionFactory(url);
    }

    public abstract Connection openConnection() throws SQLException;
}
