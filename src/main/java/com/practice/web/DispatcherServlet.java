package com.practice.web;

import com.practice.web.context.ApplicationContext;
import com.practice.web.context.NotFoundRouteException;
import com.practice.web.context.RequestResolver;
import com.practice.web.context.Router;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DispatcherServlet extends HttpServlet {

    private RequestResolver router;
    private String rootView;

    @Override
    public void init() {
        router = ((ApplicationContext) getServletContext().getAttribute("context")).getMappingResolver();
        rootView = getServletContext().getInitParameter("endview");
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if ("/".equals(req.getRequestURI())) {
            req.getRequestDispatcher(rootView).forward(req, resp);
        } else {
            try {
                router.resolve(req, resp);
            } catch (NotFoundRouteException e) {
                //resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                req.getRequestDispatcher(rootView).include(req, resp);
            }
        }
    }
}
