package com.practice.web.services;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;
import com.practice.theater.repository.PlayDateRepository;
import com.practice.theater.repository.PlayRepository;
import com.practice.web.dto.LitePlayDateDto;
import com.practice.web.dto.PlayWithDatesDto;
import com.practice.web.services.interfaces.PlayService;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class PlayServiceImpl implements PlayService {

    private final PlayRepository repository = ServiceLocator.getInstance().getRepositoryFactory().playRepository();
    private final PlayDateRepository pdRepository = ServiceLocator.getInstance().getRepositoryFactory().playDateRepository();

    @Override
    public List<PlayWithDatesDto> getAllPlays() {
        return repository.getAll().stream()
                .map(p -> toPlayWithDates(p, null))
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayWithDatesDto> getPlaysAfter(Instant date) {
        List<Play> allPlays = repository.getAll();
        return  allPlays.stream()
                .map(p -> toPlayWithDates(p, date))
                .filter(PlayWithDatesDto::hasDates)
                .collect(Collectors.toList());
    }

    private PlayWithDatesDto toPlayWithDates(Play play, Instant date) {
        PlayWithDatesDto dto = PlayWithDatesDto.from(play);
        List<PlayDate> dates = date != null ? pdRepository.getPlayDatesByPlay(play, date)
                : pdRepository.getPlayDatesByPlay(play);
        dto.setDates(dates.stream().map(LitePlayDateDto::from).collect(Collectors.toList()));
        return dto;
    }
}
