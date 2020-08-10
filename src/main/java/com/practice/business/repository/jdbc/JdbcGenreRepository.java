package com.practice.business.repository.jdbc;

import com.practice.business.models.Genre;
import com.practice.business.repository.GenreRepository;

public class JdbcGenreRepository extends JdbcRepository<Long, Genre> implements GenreRepository {
    public JdbcGenreRepository() {
        super(Genre.class);
    }
}
