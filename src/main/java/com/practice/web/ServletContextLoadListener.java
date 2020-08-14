package com.practice.web;

import com.practice.theater.ServiceLocator;
import com.practice.web.context.ApplicationContext;
import com.practice.web.context.security.RequestAuthorize;
import com.practice.web.controllers.SignController;
import com.practice.web.controllers.api.UserController;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.sql.SQLException;

/**
 * Setup application context
 */
public class ServletContextLoadListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent s) {
        ApplicationContext context = new ApplicationContext.Builder()
                .addController(new UserController())
                .addController(new SignController())
                .addAuthorization(new RequestAuthorize())
                .autoResolveNotFound(false)
                .build();
        context.registerJdbcDriver();
        try {
            ServiceLocator.getInstance().getConnectionFactory().openConnection().close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        s.getServletContext().setAttribute("context", context);
    }
}
