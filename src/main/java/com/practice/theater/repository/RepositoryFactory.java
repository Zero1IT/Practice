package com.practice.theater.repository;

import com.practice.theater.repository.jdbc.JdbcRepositoryFactory;
import com.practice.theater.repository.jdbc.JdbcTokenRepository;

public interface RepositoryFactory {

    static RepositoryFactory getJdbcFactory() {
        return new JdbcRepositoryFactory();
    }

    AuthorRepository authorRepository();
    GenreRepository genreRepository();
    PlayDateRepository playDateRepository();
    PlayRepository playRepository();
    UserRepository userRepository();
    JdbcTokenRepository tokenRepository();
}
