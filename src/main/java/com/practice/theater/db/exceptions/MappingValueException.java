package com.practice.theater.db.exceptions;

import java.lang.reflect.Field;

public class MappingValueException extends DatabaseException {
    private final Field field;

    public MappingValueException(String message) {
        super(message);
        field = null;
    }

    public MappingValueException(Field field) {
        this.field = field;
    }

    @Override
    public String getMessage() {
        return field == null ? super.getMessage() :
                String.format("Primary key '%s' cannot be annotated with Mapper", field.getName());
    }
}
