package com.practice.theater.db.annotations;

public interface Converter<OUT, IN> {
    OUT convertTo(IN obj);
    IN convertFrom(OUT entity);
}
