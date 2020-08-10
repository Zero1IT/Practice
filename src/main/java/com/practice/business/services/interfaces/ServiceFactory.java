package com.practice.business.services.interfaces;

public interface ServiceFactory {

    static ServiceFactory getServiceFactory() {
        return new com.practice.business.services.ServiceFactory();
    }

    SignService signService();
}
