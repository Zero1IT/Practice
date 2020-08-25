package com.practice.web.services.impl;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.xml.HallRowTakenPlace;
import com.practice.theater.repository.CategoryRepository;
import com.practice.theater.repository.HallRepository;
import com.practice.theater.repository.HallRowRepository;
import com.practice.theater.repository.RepositoryFactory;
import com.practice.web.dto.CategoryDto;
import com.practice.web.dto.HallDto;
import com.practice.web.dto.HallRowDto;
import com.practice.web.dto.HallRowInfoDto;
import com.practice.web.services.TheaterConstructionService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;

public class TheaterConstructionServiceImpl implements TheaterConstructionService {

    private final RepositoryFactory factory = ServiceLocator.getInstance().getRepositoryFactory();
    private final HallRepository hallRepository = factory.hallRepository();
    private final HallRowRepository rowRepository = factory.hallRowRepository();
    private final CategoryRepository categoryRepository = factory.categoryRepository();

    @Override
    public List<HallDto> getHalls() {
        return hallRepository.getAll().stream()
                .map(HallDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<HallRowDto> getHallRows(long hallId) {
        return rowRepository.getHallRowsByHallId(hallId).stream()
                .map(HallRowDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public HallRowInfoDto getHallRowInfo(long dateId, long hallId) {
        HallRowInfoDto info = new HallRowInfoDto();
        info.setRows(getHallRows(hallId));
        List<HallRowTakenPlace> places = rowRepository.rowNumberWithAssociatedTakenPlaces(dateId, hallId);
        Map<Integer, List<Integer>> collect = places.stream()
                .collect(groupingBy(HallRowTakenPlace::getNumber,
                        mapping(HallRowTakenPlace::getPlace, toList())));
        info.setExclude(collect);
        return info;
    }

    @Override
    public List<CategoryDto> getAllCategoriesOrSingle(long id) {
        return id > 0 ?
                Collections.singletonList(categoryRepository.getById(id).map(CategoryDto::from).orElse(null))
                : categoryRepository.getAll().stream().map(CategoryDto::from).collect(Collectors.toList());
    }
}
