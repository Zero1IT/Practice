package com.practice.web.services.impl;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.RefreshToken;
import com.practice.theater.repository.TokenRepository;
import com.practice.web.services.TokenService;

import java.util.Optional;

public class TokenServiceImpl implements TokenService {

    private final TokenRepository repository = ServiceLocator.getInstance().getRepositoryFactory().tokenRepository();

    @Override
    public Optional<String> findRefreshToken(long userId) {
        return repository.findTokenByUserId(userId).map(RefreshToken::getToken);
    }

    @Override
    public boolean saveRefreshToken(long userId, String token) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setToken(token);
        return repository.addOrUpdate(refreshToken);
    }

    @Override
    public void deleteTokenByUserId(long userId) {
        repository.findTokenByUserId(userId)
                .ifPresent(repository::remove);
    }
}
