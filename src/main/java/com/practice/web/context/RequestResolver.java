package com.practice.web.context;

import com.practice.web.controllers.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface RequestResolver {
    void resolve(HttpServletRequest req, HttpServletResponse resp) throws IOException, NotFoundRouteException;
    void addMapping(Controller controller);
}
