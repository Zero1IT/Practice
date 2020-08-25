package com.practice.web.api;

import com.practice.theater.ServiceLocator;
import com.practice.web.config.WebController;
import com.practice.web.config.WebParam;
import com.practice.web.config.WebRequest;
import com.practice.web.dto.CategoryDto;
import com.practice.web.dto.HallDto;
import com.practice.web.dto.HallRowDto;
import com.practice.web.dto.HallRowInfoDto;
import com.practice.web.services.TheaterConstructionService;

import java.util.Collections;
import java.util.List;

@WebController("/api/construction")
public class TheaterConstructionController {

    private final TheaterConstructionService service = ServiceLocator
            .getInstance().getServiceFactory().theaterConstructionService();

    @WebRequest("/halls")
    public List<HallDto> getAllHals() {
        return service.getHalls();
    }

    @WebRequest("/rows")
    public List<HallRowDto> getHallRowsByHall(@WebParam("hall") String hall) {
        if (hall != null) {
            return service.getHallRows(Long.parseLong(hall));
        }
        return Collections.emptyList();
    }

    @WebRequest("/rows/info")
    public HallRowInfoDto getHallRowInfo(@WebParam("date") String date, @WebParam("hall") String hall) {
        if (date != null && hall != null) {
            return service.getHallRowInfo(Long.parseLong(date), Long.parseLong(hall));
        }
        return null;
    }

    @WebRequest("/category")
    public List<CategoryDto> getCategories(@WebParam("id") String id) {
        return service.getAllCategoriesOrSingle(id == null ? 0 : Long.parseLong(id));
    }
}
