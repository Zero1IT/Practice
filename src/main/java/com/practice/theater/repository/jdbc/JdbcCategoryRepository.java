package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.custom.Pair;
import com.practice.theater.models.xml.Category;
import com.practice.theater.repository.CategoryRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcCategoryRepository extends JdbcRepository<Long, Category> implements CategoryRepository {

    private static final Logger LOGGER = LogManager.getLogger(JdbcCategoryRepository.class);

    public JdbcCategoryRepository() {
        super(Category.class);
    }

    @Override
    public List<Pair<Category, Integer>> getCategoriesOfOrder(long orderId) {
        List<Pair<Category, Integer>> list = new ArrayList<>();
        try (Connection con = ServiceLocator.getInstance().getConnectionFactory().openConnection();
             PreparedStatement stm = con.prepareStatement(ServiceLocator.getInstance().getQuery("order.categories"))) {
            stm.setLong(1, orderId);
            try (ResultSet resultSet = stm.executeQuery()) {
                while (resultSet.next()) {
                    list.add(new Pair<>(ejectInstance(resultSet), resultSet.getInt("countCategory")));
                }
            }
        } catch (SQLException e) {
            LOGGER.error(e);
        }
        return list;
    }
}
