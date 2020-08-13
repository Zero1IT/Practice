package com.practice.theater.repository;

import com.practice.theater.models.Role;
import com.practice.theater.models.User;

import java.util.Optional;

public interface UserRepository extends Repository<Long, User> {
    Optional<User> findUser(String email, String password);
    Role getRoleById(long id);
}
