package com.practice.web.validators;


public interface Validator<T> {
    boolean isValid(T item);
    String getLastErrorMessage();
}
