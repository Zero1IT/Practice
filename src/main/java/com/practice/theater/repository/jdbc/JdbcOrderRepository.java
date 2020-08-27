package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Order;
import com.practice.theater.repository.OrderRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class JdbcOrderRepository extends JdbcRepository<Long, Order> implements OrderRepository {

    private static final Logger LOGGER = LogManager.getLogger(JdbcOrderRepository.class);

    public JdbcOrderRepository() {
        super(Order.class);
    }

    @Override
    public List<Order> getNotConfirmedOrders() {
        return findByKeyInstances(getFieldTableName("confirmed"), false);
    }

    @Override
    public List<Order> getNotConfirmedOrders(long limit, long offset) {
        return paginationConditionSelect(getFieldTableName("confirmed"), false, limit, offset);
    }

    @Override
    public long notConfirmedOrdersCount() {
        return countCondition(getFieldTableName("confirmed"), false);
    }

    @Override
    public Optional<Order> get(long id, long userId) {
        try (Connection connection = ServiceLocator.getInstance().getConnectionFactory().openConnection();
            PreparedStatement stm = connection.prepareStatement(ServiceLocator.getInstance().getQuery("order.taken"))) {
            stm.setLong(1, id);
            stm.setLong(2, userId);
            try (ResultSet resultSet = stm.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(ejectInstance(resultSet));
                }
            }
        } catch (SQLException e) {
            LOGGER.error(e);
        }
        return Optional.empty();
    }
}
