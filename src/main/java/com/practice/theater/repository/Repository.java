package com.practice.theater.repository;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface Repository<K extends Serializable, T> {
    <S extends T> void add(S model);
    <S extends T> void addAll(Collection<S> models);
    Optional<T> getById(K id);
    List<T> getAll();
    boolean update(T model);
    boolean existsWithId(K id);
    void removeById(K id);
    void remove(T model);
    long count();
}
