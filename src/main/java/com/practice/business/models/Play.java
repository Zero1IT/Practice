package com.practice.business.models;

import com.practice.business.db.annotations.Column;
import com.practice.business.db.annotations.Constraint;
import com.practice.business.db.annotations.Table;

@Table(name = "Plays")
public final class Play {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "title")
    private String title;
    @Column(name = "authorId")
    @Constraint(mappedBy = "id")
    private Author author;
    @Column(name = "genreId")
    @Constraint(mappedBy = "id")
    private Genre genre;

    public Play() { }

    public Play(long id, String title, Author author, Genre genre) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public Genre getGenre() {
        return genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }
}
