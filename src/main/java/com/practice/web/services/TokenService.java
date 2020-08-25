package com.practice.web.services;

import java.util.Optional;

public interface TokenService {
    Optional<String> findRefreshToken(long userId);
    boolean saveRefreshToken(long userId, String token);
    void deleteTokenByUserId(long userId);
}
