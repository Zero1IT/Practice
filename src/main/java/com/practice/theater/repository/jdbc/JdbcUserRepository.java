package com.practice.theater.repository.jdbc;

import com.practice.theater.converters.RoleConverter;
import com.practice.theater.models.Role;
import com.practice.theater.models.User;
import com.practice.theater.repository.UserRepository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

public class JdbcUserRepository extends JdbcRepository<Long, User> implements UserRepository {

    public JdbcUserRepository() {
        super(User.class);
    }

    @Override
    public Optional<User> findUser(String email, String password) {
        List<User> users = findByKeyInstances(getFieldTableName("email"), email);
        if (!users.isEmpty() && users.get(0).getPassword().equals(password)) {
            return Optional.of(users.get(0));
        }
        return Optional.empty();
    }

    @Override
    public Role getRoleByUserId(long id) {
        RoleConverter converter = new RoleConverter();
        AtomicReference<Role> roleReference = new AtomicReference<>();
        executeAsTransaction(connection -> {
            try (PreparedStatement statement = connection.prepareStatement("SELECT roleLvl FROM users WHERE id=?;")) {
                statement.setLong(1, id);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        roleReference.set(converter.convertTo(resultSet.getInt(1)));
                    }
                }
            }
        });
        return roleReference.get();
    }
}
