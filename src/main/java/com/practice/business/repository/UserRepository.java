package com.practice.business.repository;

import com.practice.business.models.User;

import java.util.Optional;

public interface UserRepository extends Repository<Long, User> {
    Optional<User> findUser(String email, String password);
}
