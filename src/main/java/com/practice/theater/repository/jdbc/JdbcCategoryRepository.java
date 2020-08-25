package com.practice.theater.repository.jdbc;

import com.practice.theater.models.xml.Category;
import com.practice.theater.repository.CategoryRepository;

public class JdbcCategoryRepository extends JdbcRepository<Long, Category> implements CategoryRepository {
    public JdbcCategoryRepository() {
        super(Category.class);
    }
}
