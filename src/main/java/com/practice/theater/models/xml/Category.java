package com.practice.theater.models.xml;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Table;

import java.math.BigDecimal;

@Table(name = "TicketCategories")
public class Category {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "name")
    private String name;
    @Column(name = "price")
    private BigDecimal price;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
