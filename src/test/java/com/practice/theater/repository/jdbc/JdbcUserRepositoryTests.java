package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;
import com.practice.theater.models.Role;
import com.practice.theater.models.User;
import com.practice.theater.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.sql.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JdbcUserRepositoryTests {

    private final UserRepository repository = new JdbcUserRepository();

    @Test
    void insertAndDeleteTest() throws SQLException {

        User user = new User("password", "my_email", "+37544612744", "stifller", Role.COURIER);
        long initCount = repository.count();
        repository.add(user);
        assertEquals(initCount + 1, repository.count());

        try (Connection connection = DriverManager.getConnection(ServiceLocator.getInstance().getProperty("database.url"));
             PreparedStatement statement = connection.prepareStatement("SELECT COUNT(*) FROM users WHERE id=" + user.getId())) {
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            long count = resultSet.getLong(1);
            assertEquals(1, count);
            repository.remove(user);
            assertEquals(initCount, repository.count());
        }
    }

    @Test
    void insertMultipleUsersAndRemoveTest() throws SQLException {
        User user1 = new User("password", "em1", "pn1", "name", Role.USER);
        User user2 = new User("password", "em2", "pn2", "name", Role.USER);
        User user3 = new User("password", "em3", "pn3", "name", Role.USER);
        User user4 = new User("password", "em4", "pn4", "name", Role.USER);
        User user5 = new User("password", "em5", "pn5", "name", Role.USER);
        User user6 = new User("password", "em6", "pn6", "name", Role.USER);
        List<User> users = Arrays.asList(user1, user2, user3, user4, user5, user6);
        long initCount = repository.count();
        repository.addAll(users);
        assertEquals(initCount + users.size(), repository.count());
        try (Connection connection = DriverManager.getConnection(ServiceLocator.getInstance().getProperty("database.url"));
             PreparedStatement statement = connection.prepareStatement("SELECT COUNT(*) FROM users WHERE id>=" + user1.getId())) {
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            long count = resultSet.getLong(1);
            assertEquals(count, users.size());
            for (User user : users) {
                repository.remove(user);
            }
            assertEquals(initCount, repository.count());
        }
    }

    @Test
    void removeByIdAndExistsCheckTest() {
        User user1 = new User("password", "em1", "pn1", "name", Role.USER);
        User user2 = new User("password", "em2", "pn2", "name", Role.USER);
        long initCount = repository.count();
        List<User> users = Arrays.asList(user1, user2);
        repository.addAll(users);
        assertEquals(initCount + users.size(), repository.count());
        repository.removeById(user1.getId());
        assertEquals(initCount + users.size() - 1, repository.count());
        assertTrue(repository.existsWithId(user2.getId()));
        repository.removeById(user2.getId());
        assertEquals(initCount, repository.count());
    }

    @Test
    void getByIdAndUpdateTest() throws SQLException {
        String email = "this.email@gmail.com";
        User $ = new User("password", "em1", "pn1", "name", Role.USER);
        repository.add($);
        User user = repository.getById($.getId()).orElseThrow(RuntimeException::new);
        user.setEmail(email);
        repository.update(user);
        try (Connection connection = DriverManager.getConnection(ServiceLocator.getInstance().getProperty("database.url"));
             PreparedStatement statement = connection.prepareStatement("SELECT email FROM users WHERE id=" + user.getId())) {
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            assertEquals(user.getEmail(), resultSet.getString(1));
            repository.remove(user);
        }
    }

    @Test
    void isExistsByIdShouldReturnFalse() {
        assertFalse(repository.existsWithId(-1L));
    }
}
