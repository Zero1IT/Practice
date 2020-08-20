package com.practice.web.dto;

import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;

import java.util.List;

public class PlayWithDatesDto {
    private long id;
    private String title;
    private String authorName;
    private String genreName;
    private List<LitePlayDateDto> dates;

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

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getGenreName() {
        return genreName;
    }

    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }

    public List<LitePlayDateDto> getDates() {
        return dates;
    }

    public void setDates(List<LitePlayDateDto> dates) {
        this.dates = dates;
    }

    public boolean hasDates() {
        return !(dates == null || dates.isEmpty());
    }

    public static PlayWithDatesDto from(Play model) {
        PlayWithDatesDto datesDto = new PlayWithDatesDto();
        datesDto.id = model.getId();
        datesDto.title = model.getTitle();
        datesDto.authorName = model.getAuthor().getName();
        datesDto.genreName = model.getGenre().getTitle();
        return datesDto;
    }
}
