package com.practice.theater.models;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Constraint;
import com.practice.theater.db.annotations.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Table(name = "Orders")
public class Order {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "userId")
    @Constraint(mappedBy = "id")
    private User user;
    @Column(name = "cost")
    private BigDecimal cost;
    @Column(name = "quantity")
    private int quantity;
    @Column(name = "confirmed")
    private boolean confirmed;
    @Column(name = "paid")
    private boolean paid;
    @Column(name = "createdAt")
    private Instant date = Instant.now();
    @Column(name = "courierId")
    @Constraint(mappedBy = "id")
    private User courier;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public User getCourier() {
        return courier;
    }

    public void setCourier(User courier) {
        this.courier = courier;
    }
}
