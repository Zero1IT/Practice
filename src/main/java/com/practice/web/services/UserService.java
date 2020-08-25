package com.practice.web.services;

import com.practice.theater.models.Role;
import com.practice.web.dto.UserDto;

import java.util.List;

public interface UserService {
    Role getUserRole(long userId);
    List<UserDto> getUsersListOrSingle(long id);
}
