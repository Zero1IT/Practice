package com.practice.theater.repository;

import com.practice.theater.repository.jdbc.JdbcRepositoryFactory;

public interface RepositoryFactory {

    static RepositoryFactory getJdbcFactory() {
        return new JdbcRepositoryFactory();
    }

    AuthorRepository authorRepository();
    GenreRepository genreRepository();
    PlayDateRepository playDateRepository();
    PlayRepository playRepository();
    UserRepository userRepository();
    TokenRepository tokenRepository();
    HallRepository hallRepository();
    HallRowRepository hallRowRepository();
    CategoryRepository categoryRepository();
    OrderRepository orderRepository();
    OrderPlaceRepository orderPlaceRepository();
}
