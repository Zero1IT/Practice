package com.practice.business.db;

import com.practice.business.db.jdbc.JdbcPooledConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;

public abstract class ConnectionFactory {

    public static ConnectionFactory getPooledConnectionFactory(String url) {
        return new JdbcPooledConnectionFactory(url);
    }

    public abstract Connection openConnection() throws SQLException;
}
