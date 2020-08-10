package com.practice.business.services;

import com.practice.business.services.interfaces.SignService;

public class ServiceFactory implements com.practice.business.services.interfaces.ServiceFactory {

    private SignService signService;

    @Override
    public SignService signService() {
        return signService != null ? signService : (signService = new com.practice.business.services.SignService());
    }
}
