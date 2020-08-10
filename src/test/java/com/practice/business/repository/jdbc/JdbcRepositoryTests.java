package com.practice.business.repository.jdbc;

import com.practice.business.ServiceLocator;
import com.practice.business.models.Play;
import com.practice.business.models.PlayDate;
import org.junit.jupiter.api.Test;

import java.sql.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SuppressWarnings("rawtypes")
class JdbcRepositoryTests {

    private final JdbcRepository[] repositories = {
            new JdbcUserRepository(), new JdbcAuthorRepository(), new JdbcGenreRepository(),
            new JdbcPlayRepository(), new JdbcPlayDateRepository()
    };

    @Test
    void selectAllTest() throws SQLException {
        String[] tables = {"Users", "Authors", "Genres", "Plays", "Dates"};
        int i = 0;
        for (JdbcRepository repository : repositories) {
            @SuppressWarnings("StringOperationCanBeSimplified")
            String st = new String("SELECT COUNT(*) FROM " + tables[i++]); // for disable sql context
            try (Connection connection = DriverManager.getConnection(ServiceLocator.getInstance().getProperty("database.url"));
                 PreparedStatement statement = connection.prepareStatement(st)) {
                ResultSet resultSet = statement.executeQuery();
                resultSet.next();
                long size = resultSet.getLong(1);
                assertEquals(size, repository.getAll().size());
                assertEquals(size, repository.count());
                if (repository.getClass().equals(JdbcPlayDateRepository.class)) {
                    for (Object o : repository.getAll()) {
                        System.out.println(((PlayDate) o).getPlay().getTitle());
                    }
                }
            }
        }
    }
}
