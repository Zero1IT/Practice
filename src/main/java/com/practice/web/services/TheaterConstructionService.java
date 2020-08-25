package com.practice.web.services;

import com.practice.web.dto.CategoryDto;
import com.practice.web.dto.HallDto;
import com.practice.web.dto.HallRowDto;
import com.practice.web.dto.HallRowInfoDto;

import java.util.List;

public interface TheaterConstructionService {
    List<HallDto> getHalls();
    List<HallRowDto> getHallRows(long hallId);
    HallRowInfoDto getHallRowInfo(long dateId, long hallId);
    List<CategoryDto> getAllCategoriesOrSingle(long id);
}
