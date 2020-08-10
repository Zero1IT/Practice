package com.practice.business.db.exceptions;

public class ForeignKeyException extends DatabaseException {
    public ForeignKeyException(String message) {
        super(message);
    }
}
