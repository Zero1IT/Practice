package com.practice.theater.repository.jdbc;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public abstract class JdbcRepository<K extends Serializable, T> extends GenericJdbcRepository<K, T> {

    JdbcRepository(Class<T> cl) {
        super(cl);
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
    public List<T> getAll() {
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

    @Override
    public List<T> pagination(long limit, long offset) {
        return paginationSelect(limit, offset);
    }
}
