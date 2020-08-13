package com.practice.web.services;

import com.practice.theater.ServiceLocator;
import com.practice.theater.Utils;
import com.practice.theater.models.User;
import com.practice.theater.repository.UserRepository;
import com.practice.web.services.interfaces.SignService;
import com.practice.web.dto.CredentialsDto;

import java.util.concurrent.atomic.AtomicLong;

public class SignServiceImpl implements SignService {

    private final UserRepository repository = ServiceLocator.getInstance().getRepositoryFactory().userRepository();

    @Override
    public long saveUser(CredentialsDto dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getUsername());
        user.setPhone(dto.getPhone());
        user.setPassword(Utils.hash(dto.getPassword()));
        user.setRole(dto.getRole());
        repository.add(user);
        return user.getId();
    }

    @Override
    public long findUser(CredentialsDto dto) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            throw new IllegalArgumentException("Email or password doesn't exist");
        }

        AtomicLong id = new AtomicLong(0);
        String password = Utils.hash(dto.getPassword());

        repository.findUser(dto.getEmail(), password).ifPresent(user -> {
            dto.setUsername(user.getName());
            dto.setPhone(user.getPhone());
            dto.setRole(user.getRole());
            id.set(user.getId());
        });

        return id.get();
    }
}
