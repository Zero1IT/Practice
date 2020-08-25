package com.practice.web.services.impl;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.theater.repository.UserRepository;
import com.practice.web.dto.UserDto;
import com.practice.web.services.UserService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserServiceImpl implements UserService {

    private final UserRepository repository = ServiceLocator.getInstance().getRepositoryFactory().userRepository();

    @Override
    public Role getUserRole(long userId) {
        return repository.getRoleByUserId(userId);
    }

    @Override
    public List<UserDto> getUsersListOrSingle(long id) {
        return id > 0 ?
                Collections.singletonList(repository.getById(id).map(UserDto::from).orElse(null))
                : repository.getAll().stream().map(UserDto::from).collect(Collectors.toList());
    }
}
