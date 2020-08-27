package com.practice.theater.repository;

import com.practice.theater.models.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends Repository<Long, Order> {
    List<Order> getNotConfirmedOrders();
    List<Order> getNotConfirmedOrders(long limit, long offset);
    long notConfirmedOrdersCount();
    Optional<Order> get(long id, long userId);
}
