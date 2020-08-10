package com.practice.business.repository.jdbc;

import com.practice.business.models.User;
import com.practice.business.repository.UserRepository;

import java.util.List;
import java.util.Optional;

public class JdbcUserRepository extends JdbcRepository<Long, User> implements UserRepository {

    public JdbcUserRepository() {
        super(User.class);
    }

    @Override
    public Optional<User> findUser(String email, String password) {
        List<User> users = findByKeyInstances(getFieldTableName("email"), email, null);
        if (!users.isEmpty() && users.get(0).getPassword().equals(password)) {
            return Optional.of(users.get(0));
        }
        return Optional.empty();
    }
}
