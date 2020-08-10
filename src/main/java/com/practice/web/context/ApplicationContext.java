package com.practice.web.context;

import com.practice.web.controllers.Controller;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.InvocationTargetException;
import java.util.HashSet;
import java.util.Set;

public class ApplicationContext {

    private static final Logger logger = LogManager.getLogger(ApplicationContext.class);
    private Router mappingResolver;

    private ApplicationContext() { }

    /**
     * Tries to find jdbc driver and registers it
     */
    public void registerJdbcDriver() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver").getDeclaredConstructor().newInstance();
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException |
                NoSuchMethodException | ClassNotFoundException e) {
            logger.error(e);
        }
    }

    public RequestResolver getMappingResolver() {
        return mappingResolver;
    }

    public static class Builder {
        private final ApplicationContext applicationContext;
        private final Set<Controller> controllers = new HashSet<>();

        public Builder() {
            applicationContext = new ApplicationContext();
        }

        /**
         * Add controller to application
         * @param controller - controller {@link Controller}
         * @return this object {@link ApplicationContext.Builder}
         */
        public Builder addController(Controller controller) {
            controllers.add(controller);
            return this;
        }

        /**
         * Creates router with added controllers
         * @param autoResolve - auto handle if controller doesn't exists
         * @return this object {@link ApplicationContext.Builder}
         */
        public Builder registerMapping(boolean autoResolve) {
            applicationContext.mappingResolver = new Router(autoResolve);
            for (Controller controller : controllers) {
                applicationContext.mappingResolver.addMapping(controller);
            }
            return this;
        }

        /**
         * Complete application context building
         * @return application context object {@link ApplicationContext}
         */
        public ApplicationContext build() {
            return applicationContext;
        }
    }
}
