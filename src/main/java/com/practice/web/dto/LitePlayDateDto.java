package com.practice.web.dto;

import com.practice.theater.models.PlayDate;

import java.time.Instant;

public class LitePlayDateDto {
    private long id;
    private Instant date;

    public static LitePlayDateDto from(PlayDate playDate) {
        LitePlayDateDto dateDto = new LitePlayDateDto();
        dateDto.date = playDate.getDate();
        dateDto.id = playDate.getId();
        return dateDto;
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
}
