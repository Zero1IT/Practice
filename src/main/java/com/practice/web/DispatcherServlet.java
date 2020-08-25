package com.practice.web;

import com.practice.web.config.NotFoundRouteException;
import com.practice.web.config.RequestResolver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class DispatcherServlet extends HttpServlet {

    private static final Logger LOGGER = LogManager.getLogger(DispatcherServlet.class);
    private RequestResolver router; // NOSONAR
    private String rootView; // NOSONAR

    @Override
    public void init() {
        router = ((ApplicationContext) getServletContext().getAttribute("context")).getMappingResolver();
        rootView = getServletContext().getInitParameter("endview");
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        LOGGER.info(req.getRequestURI());
        if ("/".equals(req.getRequestURI())) {
            req.getRequestDispatcher(rootView).forward(req, resp);
        } else {
            try {
                router.resolve(req, resp);
            } catch (NotFoundRouteException e) {
                req.getRequestDispatcher(rootView).include(req, resp);
            }
        }
    }
}
