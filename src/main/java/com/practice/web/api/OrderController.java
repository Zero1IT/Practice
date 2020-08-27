package com.practice.web.api;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.config.*;
import com.practice.web.config.security.Authorize;
import com.practice.web.dto.OrderDto;
import com.practice.web.dto.JwtPayload;
import com.practice.web.dto.ClientOrderDto;
import com.practice.web.dto.OrderInfoDto;
import com.practice.web.services.OrderService;

import java.util.List;

@WebController("/api/orders")
public class OrderController {

    private final OrderService service = ServiceLocator.getInstance().getServiceFactory().orderService();

    @Authorize(Role.USER)
    @WebRequest(value = "/commit", method = HttpMethod.POST)
    public OrderDto commitOrder(@WebBody ClientOrderDto dto, JwtPayload payload) {
        return service.commitOrder(dto, payload.getUserId());
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/actual")
    public List<OrderDto> getActualOrders(@WebParam("limit") String limit, @WebParam("offset") String offset) {
        long lim = limit != null ? Long.parseLong(limit) : -1;
        long off = offset != null ? Long.parseLong(offset) : -1;
        return service.actualOrders(lim, off);
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/actual/count")
    public String actualCount() {
        return String.valueOf(service.actualOrdersCount());
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/take", method = HttpMethod.PUT)
    public OrderDto takeOrder(@WebParam("id") String id, JwtPayload payload) {
        if (id != null) {
            return service.takeOrder(Long.parseLong(id), payload.getUserId());
        }
        return null;
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/pay", method = HttpMethod.PUT)
    public OrderDto courierAcceptOrder(@WebParam("id") String id, JwtPayload payload) {
        if (id != null) {
            return service.acceptPayment(Long.parseLong(id), payload.getUserId());
        }
        return null;
    }

    @Authorize(Role.COURIER)
    @WebRequest(value = "/info")
    public OrderInfoDto getOrderInfo(@WebParam("id") String id) {
        if (id != null) {
            return service.getOrderInfo(Long.parseLong(id));
        }
        return null;
    }
}
