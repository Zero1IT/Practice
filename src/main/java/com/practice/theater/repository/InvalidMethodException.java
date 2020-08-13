package com.practice.theater.repository;

public class InvalidMethodException extends RuntimeException {
    public InvalidMethodException(String message) {
        super(message);
    }

    public InvalidMethodException(Throwable cause) {
        super(cause);
    }

    public InvalidMethodException(String message, Throwable cause) {
        super(message, cause);
    }
}
