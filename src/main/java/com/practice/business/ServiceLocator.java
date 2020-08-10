package com.practice.business;

import com.practice.business.db.ConnectionFactory;
import com.practice.business.repository.RepositoryFactory;
import com.practice.business.services.interfaces.ServiceFactory;

import java.util.ResourceBundle;

public final class ServiceLocator {

    public static final String SETTINGS_FILE = "application";
    private static ServiceLocator locator;

    public static ServiceLocator getInstance() {
        if (locator == null) {
            synchronized (ServiceLocator.class) {
                ServiceLocator service = locator;
                if (service == null) {
                    service = new ServiceLocator();
                }
                locator = service;
            }
        }
        return locator;
    }

    private final Object lock = new Object();
    private final ResourceBundle appProperties;
    private final ResourceBundle messageBundle;
    private ConnectionFactory connectionFactory;
    private RepositoryFactory repositoryFactory;
    private ServiceFactory serviceFactory;

    private ServiceLocator() {
        appProperties = ResourceBundle.getBundle(SETTINGS_FILE);
        messageBundle = ResourceBundle.getBundle("messages");
    }

    public ConnectionFactory getConnectionFactory() {
        if (connectionFactory == null) {
            synchronized (lock) {
                connectionFactory = ConnectionFactory.getPooledConnectionFactory(getProperty("database.url"));
            }
        }
        return connectionFactory;
    }

    public RepositoryFactory getRepositoryFactory() {
        if (repositoryFactory == null) {
            synchronized (lock) {
                RepositoryFactory factory = repositoryFactory;
                if (factory == null) {
                    factory = RepositoryFactory.getJdbcFactory();
                }
                repositoryFactory = factory;
            }
        }
        return repositoryFactory;
    }

    public ServiceFactory getServiceFactory() {
        if (serviceFactory == null) {
            synchronized (lock) {
                ServiceFactory factory = serviceFactory;
                if (factory == null) {
                    factory = ServiceFactory.getServiceFactory();
                }
                serviceFactory = factory;
            }
        }
        return serviceFactory;
    }

    public String getProperty(String key) {
        return appProperties.getString(key);
    }

    public String getMessage(String key) {
        return messageBundle.getString(key);
    }
}
