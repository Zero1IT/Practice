package com.practice.web.config;

public class NotFoundRouteException extends Exception {

    public NotFoundRouteException(String urlName) {
        super("Cannot resolve mapping for " + urlName);
    }
}
