package com.practice.web.context;

public class NotFoundRouteException extends Exception {

    public NotFoundRouteException(String urlName) {
        super("Cannot resolve mapping for " + urlName);
    }
}
