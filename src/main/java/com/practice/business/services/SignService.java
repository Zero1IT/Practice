package com.practice.business.services;

import com.practice.business.ServiceLocator;
import com.practice.business.models.User;
import com.practice.business.repository.UserRepository;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.utils.WebUtils;

import java.util.concurrent.atomic.AtomicLong;

public class SignService implements com.practice.business.services.interfaces.SignService {

    private final UserRepository repository = ServiceLocator.getInstance().getRepositoryFactory().userRepository();

    @Override
    public long saveUser(CredentialsDto dto) {
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getUsername());
        user.setPhone(dto.getPhone());
        user.setPassword(WebUtils.hash(dto.getPassword()));
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
        String password = WebUtils.hash(dto.getPassword());

        repository.findUser(dto.getEmail(), password).ifPresent(user -> {
            dto.setUsername(user.getName());
            dto.setPhone(user.getPhone());
            dto.setRole(user.getRole());
            id.set(user.getId());
        });

        return id.get();
    }
}
