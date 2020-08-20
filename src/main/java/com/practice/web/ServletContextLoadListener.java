package com.practice.web;

import com.practice.theater.ServiceLocator;
import com.practice.web.api.PlayController;
import com.practice.web.config.security.JwsAuthorize;
import com.practice.web.api.SignController;
import com.practice.web.api.UserController;

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
                .addController(new PlayController())
                .addAuthorization(new JwsAuthorize())
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
