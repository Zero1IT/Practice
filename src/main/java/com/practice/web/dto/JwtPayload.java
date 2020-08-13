package com.practice.web.dto;

import com.practice.theater.models.Role;

public class JwtPayload {
    private long userId;
    private Role role;

    public JwtPayload(long userId, CredentialsDto dto) {
        this.userId = userId;
        role = dto.getRole();
    }

    public JwtPayload(long userId, Role role) {
        this.userId = userId;
        this.role = role;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
