package com.practice.theater.repository.jdbc;

import com.practice.theater.models.Order;
import com.practice.theater.repository.OrderRepository;

import java.util.List;

public class JdbcOrderRepository extends JdbcRepository<Long, Order> implements OrderRepository {
    public JdbcOrderRepository() {
        super(Order.class);
    }

    @Override
    public List<Order> getNotConfirmedOrders() {
        return findByKeyInstances(getFieldTableName("confirmed"), false);
    }

    @Override
    public List<Order> getNotConfirmedOrders(long limit, long offset) {
        return paginationConditionSelect(getFieldTableName("confirmed"), false, limit, offset);
    }
}
