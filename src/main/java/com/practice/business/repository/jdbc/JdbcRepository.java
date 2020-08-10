package com.practice.business.repository.jdbc;

import java.io.Serializable;
import java.util.Collection;
import java.util.Optional;

public abstract class JdbcRepository<K extends Serializable, T> extends GenericJdbcRepository<K, T> {

    private final Class<T> entityClass;

    JdbcRepository(Class<T> cl) {
        super(cl);
        entityClass = cl;
    }

    @Override
    public <S extends T> void add(S model) {
        saveInstance(model);
    }

    @SuppressWarnings("unchecked")
    @Override
    public <S extends T> void addAll(Collection<S> models) {
        saveInstance((S[])models.toArray());
    }

    @Override
    public Optional<T> getById(K id) {
        return Optional.ofNullable(findByPrimaryKeyInstances(id));
    }

    @Override
    public Collection<T> getAll() {
        return findAllInstances();
    }

    @Override
    public boolean update(T model) {
        return updateInstance(model);
    }

    @Override
    public boolean existsWithId(K id) {
        return isExistsByPrimaryKey(id);
    }

    @Override
    public void removeById(K id) {
        deleteByPrimaryKey(id);
    }

    @Override
    public void remove(T model) {
        deleteByPrimaryKeyInstance(model);
    }
}
