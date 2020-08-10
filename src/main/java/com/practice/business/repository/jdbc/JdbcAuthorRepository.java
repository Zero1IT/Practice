package com.practice.business.repository.jdbc;

import com.practice.business.models.Author;
import com.practice.business.repository.AuthorRepository;

public class JdbcAuthorRepository extends JdbcRepository<Long, Author> implements AuthorRepository {

    JdbcAuthorRepository() {
        super(Author.class);
    }
}
