package com.practice.web.context.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface WebAuthorize {
    boolean allowAccess(HttpServletRequest req, HttpServletResponse resp, Authorize authorize);
}
