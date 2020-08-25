package com.practice.theater.repository;

import com.practice.theater.models.Order;

import java.util.List;

public interface OrderRepository extends Repository<Long, Order> {
    List<Order> getNotConfirmedOrders();
    List<Order> getNotConfirmedOrders(long limit, long offset);
}
