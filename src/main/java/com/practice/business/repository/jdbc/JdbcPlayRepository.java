package com.practice.business.repository.jdbc;

import com.practice.business.models.Play;
import com.practice.business.repository.PlayRepository;

public class JdbcPlayRepository extends JdbcRepository<Long, Play> implements PlayRepository {

    JdbcPlayRepository() {
        super(Play.class);
    }
}
