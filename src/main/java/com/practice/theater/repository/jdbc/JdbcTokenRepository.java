package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.RefreshToken;
import com.practice.theater.repository.TokenRepository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

public class JdbcTokenRepository extends JdbcRepository<Long, RefreshToken> implements TokenRepository {
    public JdbcTokenRepository() {
        super(RefreshToken.class);
    }

    @Override
    public Optional<RefreshToken> findTokenByUserId(long userId) {
        Optional<RefreshToken> result = Optional.empty();
        List<RefreshToken> users = findByKeyInstances(getFieldTableName("userId"), userId);
        if (!users.isEmpty()) {
            result = Optional.of(users.get(0));
        }
        return result;
    }

    @Override
    public boolean addOrUpdate(RefreshToken token) {
        AtomicBoolean result = new AtomicBoolean(false);
        executeAsTransaction(connection -> {
            try (PreparedStatement statement = connection.prepareStatement(ServiceLocator
                    .getInstance().getQuery("token.insert_update"), Statement.RETURN_GENERATED_KEYS)) {
                statement.setLong(1, token.getUserId());
                statement.setString(2, token.getToken());
                statement.setString(3, token.getToken());
                int s = statement.executeUpdate();
                if (s > 0) {
                    try(ResultSet generatedKey = statement.getGeneratedKeys()) {
                        if (generatedKey.next()) {
                            result.set(true);
                            token.setId(generatedKey.getLong(1));
                        }
                    }
                }
            }
        });
        return result.get();
    }
}
