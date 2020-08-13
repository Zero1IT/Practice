package com.practice.theater.models;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Table;

@Table(name = "RefreshTokens")
public class RefreshToken {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "userId")
    private long userId;
    @Column(name = "token")
    private String token;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
