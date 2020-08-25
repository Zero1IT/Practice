package com.practice.web.dto;

import com.practice.theater.models.xml.Category;

import java.math.BigDecimal;

public class CategoryDto {
    private long id;
    private String name;
    private BigDecimal price;

    public static CategoryDto from(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.id = category.getId();
        dto.name = category.getName();
        dto.price = category.getPrice();
        return dto;
    }

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
