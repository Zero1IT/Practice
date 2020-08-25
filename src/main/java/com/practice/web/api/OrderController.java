package com.practice.web.api;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.config.*;
import com.practice.web.config.security.Authorize;
import com.practice.web.dto.CompletedOrderDto;
import com.practice.web.dto.JwtPayload;
import com.practice.web.dto.OrderDto;
import com.practice.web.services.OrderService;

import java.util.List;

@WebController("/api/orders")
public class OrderController {

    private final OrderService service = ServiceLocator.getInstance().getServiceFactory().orderService();

    @Authorize(Role.USER)
    @WebRequest(value = "/commit", method = HttpMethod.POST)
    public CompletedOrderDto commitOrder(@WebBody OrderDto dto, JwtPayload payload) {
        return service.commitOrder(dto, payload.getUserId());
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/actual")
    public List<CompletedOrderDto> getActualOrders(@WebParam("limit") String limit, @WebParam("offset") String offset) {
        long lim = limit != null ? Long.parseLong(limit) : -1;
        long off = offset != null ? Long.parseLong(offset) : -1;
        return service.actualOrders(lim, off);
    }
}
