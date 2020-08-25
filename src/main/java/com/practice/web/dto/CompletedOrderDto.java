package com.practice.web.dto;

import com.practice.theater.models.Order;

import java.math.BigDecimal;

public class CompletedOrderDto {
    private long id;
    private BigDecimal cost;
    private int quantity;
    private UserDto user;

    public static CompletedOrderDto from(Order order) {
        CompletedOrderDto dto = new CompletedOrderDto();
        dto.id = order.getId();
        dto.cost = order.getCost();
        dto.quantity = order.getQuantity();
        dto.user = UserDto.from(order.getUser());
        return dto;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
