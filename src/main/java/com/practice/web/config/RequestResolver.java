package com.practice.web.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface RequestResolver {
    void resolve(HttpServletRequest req, HttpServletResponse resp) throws IOException, NotFoundRouteException;
    void addMapping(Object controller);
}
