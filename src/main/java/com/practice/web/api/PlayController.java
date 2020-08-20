package com.practice.web.api;

import com.practice.theater.ServiceLocator;
import com.practice.web.config.WebController;
import com.practice.web.config.WebRequest;
import com.practice.web.dto.PlayWithDatesDto;
import com.practice.web.services.interfaces.PlayService;

import java.time.Instant;
import java.util.List;

@WebController("/api/plays")
public class PlayController {

    private final PlayService service = ServiceLocator.getInstance().getServiceFactory().playService();

    @WebRequest
    public List<PlayWithDatesDto> getAllPlays() {
        return service.getAllPlays();
    }

    @WebRequest("/future")
    public List<PlayWithDatesDto> getFuturePlays() {
        return service.getPlaysAfter(Instant.now());
    }
}
