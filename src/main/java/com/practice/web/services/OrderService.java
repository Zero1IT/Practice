package com.practice.web.services;

import com.practice.web.dto.CompletedOrderDto;
import com.practice.web.dto.OrderDto;

import java.util.List;

public interface OrderService {
    CompletedOrderDto commitOrder(OrderDto dto, long userId);
    List<CompletedOrderDto> actualOrders(long limit, long offset);
}
