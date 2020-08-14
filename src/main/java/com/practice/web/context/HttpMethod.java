package com.practice.web.context;

public enum  HttpMethod {
    POST,
    GET,
    PUT,
    DELETE,
    HEAD,
    OPTIONS;

    /**
     * Check if methodName equals HttpMethod represented by enum
     * @param methodName - http method name
     * @return true if methodName is equal enum constant
     */
    public boolean isMethod(String methodName) {
        return this.name().equalsIgnoreCase(methodName);
    }
}
