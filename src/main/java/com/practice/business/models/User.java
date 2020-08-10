package com.practice.business.models;

import com.practice.business.converters.RoleConverter;
import com.practice.business.db.annotations.Column;
import com.practice.business.db.annotations.Mapper;
import com.practice.business.db.annotations.Table;

@Table(name = "Users")
public final class User {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "password")
    private String password;
    @Column(name = "email")
    private String email;
    @Column(name = "phone")
    private String phone;
    @Column(name = "name")
    private String name;
    @Mapper(converter = RoleConverter.class)
    @Column(name = "roleLvl")
    private Role role;

    public User() { }

    public User(String password, String email, String phone, String name, Role role) {
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.name = name;
        this.role = role;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
