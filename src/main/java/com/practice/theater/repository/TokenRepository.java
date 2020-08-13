package com.practice.theater.repository;

import com.practice.theater.models.RefreshToken;

import java.util.Optional;

public interface TokenRepository extends Repository<Long, RefreshToken> {
    Optional<RefreshToken> findTokenByUserId(long userId);
    boolean addOrUpdate(RefreshToken token);
}
