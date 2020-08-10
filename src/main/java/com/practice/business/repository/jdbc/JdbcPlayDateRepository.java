package com.practice.business.repository.jdbc;

import com.practice.business.models.PlayDate;
import com.practice.business.repository.PlayDateRepository;

public class JdbcPlayDateRepository extends JdbcRepository<Long, PlayDate> implements PlayDateRepository {
    JdbcPlayDateRepository() {
        super(PlayDate.class);
    }
}
