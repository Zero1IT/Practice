package com.practice.theater.repository;

import com.practice.theater.models.xml.HallRow;
import com.practice.theater.models.xml.HallRowTakenPlace;

import java.util.List;

public interface HallRowRepository extends Repository<Long, HallRow> {
    List<HallRow> getHallRowsByHallId(long id);
    List<HallRowTakenPlace> rowNumberWithAssociatedTakenPlaces(long dateId, long hallId);
}
