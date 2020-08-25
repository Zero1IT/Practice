package com.practice.theater.repository.jdbc;

import com.practice.theater.models.xml.Hall;
import com.practice.theater.repository.HallRepository;

public class JdbcHallRepository extends JdbcRepository<Long, Hall> implements HallRepository {
    public JdbcHallRepository() {
        super(Hall.class);
    }
}
