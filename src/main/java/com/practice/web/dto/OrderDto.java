package com.practice.web.dto;

import com.practice.theater.models.Order;

import java.math.BigDecimal;
import java.time.Instant;

public class OrderDto {
    private long id;
    private BigDecimal cost;
    private int quantity;
    private UserDto user;
    private boolean confirmed;
    private boolean paid;
    private Instant date;
    private UserDto courier;

    public static OrderDto from(Order order) {
        OrderDto dto = new OrderDto();
        dto.id = order.getId();
        dto.cost = order.getCost();
        dto.quantity = order.getQuantity();
        dto.user = UserDto.from(order.getUser());
        if (order.getCourier() != null) {
            dto.courier = UserDto.from(order.getCourier());
        }
        dto.confirmed = order.isConfirmed();
        dto.paid = order.isPaid();
        dto.date = order.getDate();
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

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public UserDto getCourier() {
        return courier;
    }

    public void setCourier(UserDto courier) {
        this.courier = courier;
    }
}
