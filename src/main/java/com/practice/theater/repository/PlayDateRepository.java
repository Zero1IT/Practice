package com.practice.theater.repository;

import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;

import java.time.Instant;
import java.util.List;

public interface PlayDateRepository extends Repository<Long, PlayDate> {
    List<PlayDate> getPlayDatesByPlay(Play play);
    List<PlayDate> getPlayDatesByPlay(Play play, Instant from);
}
