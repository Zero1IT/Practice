package com.practice.web.dto;

import com.practice.theater.models.xml.HallRow;

public class HallRowDto {
    private long id;
    private long hallId;
    private int number;
    private int count;
    private String hint;
    private long categoryId;

    public static HallRowDto from(HallRow row) {
        HallRowDto dto = new HallRowDto();
        dto.id = row.getId();
        dto.hallId = row.getHallId();
        dto.number = row.getNumber();
        dto.count = row.getCount();
        dto.hint = row.getHint();
        dto.categoryId = row.getCategoryId();
        return dto;
    }

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
