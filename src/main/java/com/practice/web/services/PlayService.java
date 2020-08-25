package com.practice.web.services;

import com.practice.web.dto.PlayWithDatesDto;

import java.time.Instant;
import java.util.List;

public interface PlayService {
    List<PlayWithDatesDto> getPlaysAfter(Instant date);
    List<PlayWithDatesDto> getAllPlays();
    PlayWithDatesDto getActualPlayById(long id);
}
