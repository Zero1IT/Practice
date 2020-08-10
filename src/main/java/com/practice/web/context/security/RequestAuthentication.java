package com.practice.web.context.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RequestAuthentication implements WebAuthentication {

    @Override
    public boolean isAuthenticated(HttpServletRequest req, HttpServletResponse resp) {
        return false;
    }

    @Override
    public boolean allowAccess(HttpServletRequest req, HttpServletResponse resp) {
        return false;
    }
}
