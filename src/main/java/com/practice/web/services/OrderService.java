package com.practice.web.services;

import com.practice.web.dto.OrderDto;
import com.practice.web.dto.ClientOrderDto;
import com.practice.web.dto.OrderInfoDto;

import java.util.List;

public interface OrderService {
    OrderDto commitOrder(ClientOrderDto dto, long userId);
    List<OrderDto> actualOrders(long limit, long offset);
    OrderDto takeOrder(long orderId, long courierId);
    OrderDto acceptPayment(long orderId, long courierId);
    OrderInfoDto getOrderInfo(long orderId);
    long actualOrdersCount();
}
