package com.practice.theater.repository;

import com.practice.theater.custom.Pair;
import com.practice.theater.models.xml.Category;

import java.util.List;

public interface CategoryRepository extends Repository<Long, Category> {
    List<Pair<Category, Integer>> getCategoriesOfOrder(long orderId);
}
