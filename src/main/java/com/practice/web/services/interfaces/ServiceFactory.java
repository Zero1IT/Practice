package com.practice.web.services.interfaces;

import com.practice.web.services.ServiceFactoryImpl;

public interface ServiceFactory {

    static ServiceFactory getServiceFactory() {
        return new ServiceFactoryImpl();
    }

    SignService signService();
    TokenService tokenService();
    UserService userService();
    PlayService playService();
}
