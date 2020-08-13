package com.practice.web.controllers.api;

import com.practice.web.context.WebController;
import com.practice.web.controllers.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebController("/api/plays")
public class PlayController implements Controller {
    @Override
    public void get(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    }
}
