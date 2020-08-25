package com.practice.web.services;

import com.practice.web.services.impl.ServiceFactoryImpl;

public interface ServiceFactory {

    static ServiceFactory getServiceFactory() {
        return new ServiceFactoryImpl();
    }

    SignService signService();
    TokenService tokenService();
    UserService userService();
    PlayService playService();
    TheaterConstructionService theaterConstructionService();
    OrderService orderService();
}
