package com.practice.business.repository.jdbc;

import com.practice.business.repository.*;

public class JdbcRepositoryFactory implements RepositoryFactory {

    private AuthorRepository authorRepository;
    private GenreRepository genreRepository;
    private PlayDateRepository playDateRepository;
    private PlayRepository playRepository;
    private UserRepository userRepository;

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
}
