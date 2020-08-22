package com.practice.theater.db;

import com.practice.theater.db.jdbc.JdbcPooledConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;

public interface ConnectionFactory {

    static ConnectionFactory getPooledConnectionFactory(String url) {
        return new JdbcPooledConnectionFactory(url);
    }

    Connection openConnection() throws SQLException;
}
