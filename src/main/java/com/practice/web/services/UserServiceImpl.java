package com.practice.web.services;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.theater.repository.UserRepository;
import com.practice.web.services.interfaces.UserService;

public class UserServiceImpl implements UserService {

    private final UserRepository repository = ServiceLocator.getInstance().getRepositoryFactory().userRepository();

    @Override
    public Role getUserRole(long userId) {
        return repository.getRoleById(userId);
    }
}
