package com.practice.theater.repository.jdbc;

import com.practice.theater.models.OrderPlace;
import com.practice.theater.repository.OrderPlaceRepository;

public class JdbcOrderPlaceRepository extends JdbcRepository<Long, OrderPlace> implements OrderPlaceRepository {
    public JdbcOrderPlaceRepository() {
        super(OrderPlace.class);
    }
}
