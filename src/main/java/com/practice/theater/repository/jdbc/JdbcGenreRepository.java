package com.practice.theater.repository.jdbc;

import com.practice.theater.models.Genre;
import com.practice.theater.repository.GenreRepository;

public class JdbcGenreRepository extends JdbcRepository<Long, Genre> implements GenreRepository {
    public JdbcGenreRepository() {
        super(Genre.class);
    }
}
