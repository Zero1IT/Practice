package com.practice.web.dto;

import com.practice.business.models.Role;

public class JwtPayload {
    private long id;
    private String username;
    private String email;
    private String phone;
    private Role role;

    public JwtPayload(long id, CredentialsDto dto) {
        this.id = id;
        username = dto.getUsername();
        email = dto.getEmail();
        phone = dto.getPhone();
        role = dto.getRole();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
