package com.practice.web.dto;

import com.practice.theater.custom.Pair;
import com.practice.theater.models.xml.Category;

import java.util.List;

public class OrderInfoDto {
    private List<Pair<Category, Integer>> categoriesOfOrder;

    public List<Pair<Category, Integer>> getCategoriesOfOrder() {
        return categoriesOfOrder;
    }

    public void setCategoriesOfOrder(List<Pair<Category, Integer>> categoriesOfOrder) {
        this.categoriesOfOrder = categoriesOfOrder;
    }
}
