package com.practice.web.services.impl;

import com.practice.web.services.*;

public class ServiceFactoryImpl implements ServiceFactory {

    private SignService signService;
    private TokenService tokenService;
    private UserService userService;
    private PlayService playService;
    private TheaterConstructionService constructionService;
    private OrderService orderService;

    @Override
    public TokenService tokenService() {
        return tokenService != null ? tokenService : (tokenService = new TokenServiceImpl());
    }

    @Override
    public SignService signService() {
        return signService != null ? signService : (signService = new SignServiceImpl());
    }

    @Override
    public UserService userService() {
        return userService != null ? userService : (userService = new UserServiceImpl());
    }

    @Override
    public PlayService playService() {
        return playService != null ? playService : (playService = new PlayServiceImpl());
    }

    @Override
    public TheaterConstructionService theaterConstructionService() {
        return constructionService != null ? constructionService : (constructionService = new TheaterConstructionServiceImpl());
    }

    @Override
    public OrderService orderService() {
        return orderService != null ? orderService : (orderService = new OrderServiceImpl());
    }
}
