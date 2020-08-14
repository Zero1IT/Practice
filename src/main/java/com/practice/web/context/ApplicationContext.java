package com.practice.web.context;

import com.practice.web.context.security.WebAuthorize;
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
        private final Set<Object> controllers = new HashSet<>();
        private WebAuthorize authorize;
        private boolean autoResolve;

        public Builder() {
            applicationContext = new ApplicationContext();
        }

        /**
         * Add controller to application
         * @param controller - controller {@link Object}
         * @return this object {@link ApplicationContext.Builder}
         */
        public Builder addController(Object controller) {
            controllers.add(controller);
            return this;
        }

        public Builder addAuthorization(WebAuthorize p) {
            authorize = p;
            return this;
        }

        /**
         * @param auto - auto handle if controller doesn't exists
         * @return this object {@link ApplicationContext.Builder}
         */
        public Builder autoResolveNotFound(boolean auto) {
            autoResolve = auto;
            return this;
        }

        /**
         * Complete application context building
         * @return application context object {@link ApplicationContext}
         */
        public ApplicationContext build() {
            applicationContext.mappingResolver = new Router(autoResolve, authorize);
            for (Object controller : controllers) {
                applicationContext.mappingResolver.addMapping(controller);
            }
            return applicationContext;
        }
    }
}
