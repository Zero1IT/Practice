package com.practice.web.services.interfaces;

import com.practice.theater.models.Role;

public interface UserService {
    Role getUserRole(long userId);
}
