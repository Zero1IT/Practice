package com.practice.theater.repository.jdbc;

import com.practice.theater.models.Play;
import com.practice.theater.repository.PlayRepository;

public class JdbcPlayRepository extends JdbcRepository<Long, Play> implements PlayRepository {

    JdbcPlayRepository() {
        super(Play.class);
    }
}
