package com.practice.web.config.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface WebAuthorize<T> {
    AuthAccess allowAccess(HttpServletRequest req, HttpServletResponse resp, Authorize authorize);
    T getAuthentication(HttpServletRequest req, HttpServletResponse resp);
}
