package com.practice.theater.db.exceptions;

public class ForeignKeyException extends DatabaseException {
    public ForeignKeyException(String message) {
        super(message);
    }
}
