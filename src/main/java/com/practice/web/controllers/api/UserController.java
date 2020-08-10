package com.practice.web.controllers.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.practice.business.repository.jdbc.JdbcUserRepository;
import com.practice.web.context.WebController;
import com.practice.web.controllers.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebController("/api/users")
public class UserController implements Controller {
    @Override
    public void get(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        resp.getWriter().write(mapper.writeValueAsString(new JdbcUserRepository().getAll()));
    }
}
