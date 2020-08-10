package com.practice.business.repository;

import com.practice.business.repository.jdbc.JdbcRepositoryFactory;

public interface RepositoryFactory {

    static RepositoryFactory getJdbcFactory() {
        return new JdbcRepositoryFactory();
    }

    AuthorRepository authorRepository();
    GenreRepository genreRepository();
    PlayDateRepository playDateRepository();
    PlayRepository playRepository();
    UserRepository userRepository();
}
