package com.practice.theater.models;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Constraint;
import com.practice.theater.db.annotations.Table;

@Table(name = "OrderPlaces")
public class OrderPlace {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Constraint(mappedBy = "id")
    @Column(name = "dateId")
    private PlayDate date;
    @Constraint(mappedBy = "id")
    @Column(name = "orderId")
    private Order order;
    @Column(name = "rowId")
    private long rowId;
    @Column(name = "placeNum")
    private int place;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public PlayDate getDate() {
        return date;
    }

    public void setDate(PlayDate date) {
        this.date = date;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public long getRowId() {
        return rowId;
    }

    public void setRowId(long rowId) {
        this.rowId = rowId;
    }

    public int getPlace() {
        return place;
    }

    public void setPlace(int place) {
        this.place = place;
    }
}
