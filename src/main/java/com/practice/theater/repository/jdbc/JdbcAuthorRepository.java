package com.practice.theater.repository.jdbc;

import com.practice.theater.models.Author;
import com.practice.theater.repository.AuthorRepository;

public class JdbcAuthorRepository extends JdbcRepository<Long, Author> implements AuthorRepository {

    JdbcAuthorRepository() {
        super(Author.class);
    }
}
