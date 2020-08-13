package com.practice.web.context.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RequestAuthorize implements WebAuthorize {

    @Override
    public boolean allowAccess(HttpServletRequest req, HttpServletResponse resp, Authorize authorize) {
        return false;
    }
}
