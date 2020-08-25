package com.practice.theater.models.xml;

import com.practice.theater.db.annotations.Column;
import com.practice.theater.db.annotations.Table;

@Table(name = "HallRows")
public class HallRow {
    @Column(name = "id", isPrimaryKey = true)
    private long id;
    @Column(name = "hallId")
    private long hallId;
    @Column(name = "number")
    private int number;
    @Column(name = "count")
    private int count;
    @Column(name = "hint")
    private String hint;
    @Column(name = "categoryId")
    private long categoryId;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getHallId() {
        return hallId;
    }

    public void setHallId(long hallId) {
        this.hallId = hallId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }
}
