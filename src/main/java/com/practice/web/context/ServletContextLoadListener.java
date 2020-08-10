package com.practice.web.context;

import com.practice.business.ServiceLocator;
import com.practice.web.controllers.RegistrationController;
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
                .addController(new RegistrationController())
                .registerMapping(false)
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
