package com.practice.web.validators;


import java.util.function.Predicate;

public interface Validator<T> {
    boolean isValid(T item);
    String getLastErrorMessage();
}
