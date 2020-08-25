package com.practice.theater.repository.jdbc;

import com.practice.theater.repository.*;

public class JdbcRepositoryFactory implements RepositoryFactory {

    private AuthorRepository authorRepository;
    private GenreRepository genreRepository;
    private PlayDateRepository playDateRepository;
    private PlayRepository playRepository;
    private UserRepository userRepository;
    private TokenRepository tokenRepository;
    private HallRepository hallRepository;
    private HallRowRepository hallRowRepository;
    private CategoryRepository categoryRepository;
    private OrderRepository orderRepository;
    private OrderPlaceRepository orderPlaceRepository;

    @Override
    public AuthorRepository authorRepository() {
        return authorRepository != null ? authorRepository : (authorRepository = new JdbcAuthorRepository());
    }

    @Override
    public GenreRepository genreRepository() {
        return genreRepository != null ? genreRepository : (genreRepository = new JdbcGenreRepository());
    }

    @Override
    public PlayDateRepository playDateRepository() {
        return playDateRepository != null ? playDateRepository : (playDateRepository = new JdbcPlayDateRepository());
    }

    @Override
    public PlayRepository playRepository() {
        return playRepository != null ? playRepository : (playRepository = new JdbcPlayRepository());
    }

    @Override
    public UserRepository userRepository() {
        return userRepository != null ? userRepository : (userRepository = new JdbcUserRepository());
    }

    @Override
    public TokenRepository tokenRepository() {
        return tokenRepository != null ? tokenRepository : (tokenRepository = new JdbcTokenRepository());
    }

    @Override
    public HallRepository hallRepository() {
        return hallRepository != null ? hallRepository : (hallRepository = new JdbcHallRepository());
    }

    @Override
    public HallRowRepository hallRowRepository() {
        return hallRowRepository != null ? hallRowRepository : (hallRowRepository = new JdbcHallRowRepository());
    }

    @Override
    public CategoryRepository categoryRepository() {
        return categoryRepository != null ? categoryRepository : (categoryRepository = new JdbcCategoryRepository());
    }

    @Override
    public OrderRepository orderRepository() {
        return orderRepository != null ? orderRepository : (orderRepository = new JdbcOrderRepository());
    }

    @Override
    public OrderPlaceRepository orderPlaceRepository() {
        return orderPlaceRepository != null ? orderPlaceRepository : (orderPlaceRepository = new JdbcOrderPlaceRepository());
    }
}
