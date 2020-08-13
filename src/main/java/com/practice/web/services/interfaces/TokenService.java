package com.practice.web.services.interfaces;

import java.util.Optional;

public interface TokenService {
    Optional<String> findRefreshToken(long userId);
    boolean saveRefreshToken(long userId, String token);
}
