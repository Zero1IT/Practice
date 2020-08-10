package com.practice.business.models;

import com.practice.business.db.annotations.Column;
import com.practice.business.db.annotations.Table;

@Table(name = "Genres")
public final class Genre {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "title")
    private String title;

    public Genre() { }

    public Genre(long id, String title) {
        this.id = id;
        this.title = title;
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
}
