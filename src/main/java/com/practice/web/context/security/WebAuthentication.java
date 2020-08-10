package com.practice.web.context.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface WebAuthentication {
    boolean isAuthenticated(HttpServletRequest req, HttpServletResponse resp);
    boolean allowAccess(HttpServletRequest req, HttpServletResponse resp);
}
