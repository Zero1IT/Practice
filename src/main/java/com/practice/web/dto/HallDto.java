package com.practice.web.dto;

import com.practice.theater.models.xml.Hall;

public class HallDto {
    private long id;
    private String name;

    public static HallDto from(Hall hall) {
        HallDto dto = new HallDto();
        dto.id = hall.getId();
        dto.name = hall.getName();
        return dto;
    }

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
