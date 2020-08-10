package com.practice.business.models;

import com.practice.business.db.annotations.Column;
import com.practice.business.db.annotations.Constraint;
import com.practice.business.db.annotations.Table;

import java.time.Instant;

@Table(name = "Dates")
public class PlayDate {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "_date")
    private Instant date;
    @Column(name = "playId")
    @Constraint(mappedBy = "id")
    private Play play;

    public PlayDate() { }

    public PlayDate(long id, Instant date, Play play) {
        this.id = id;
        this.date = date;
        this.play = play;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Play getPlay() {
        return play;
    }

    public void setPlay(Play play) {
        this.play = play;
    }
}
