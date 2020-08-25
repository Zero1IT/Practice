package com.practice.theater.models.xml;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Table;

@Table(name = "Hall")
public class Hall {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "name")
    private String name;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
