package com.practice.web.services.impl;

import com.practice.theater.ServiceLocator;
import com.practice.theater.db.exceptions.DatabaseException;
import com.practice.theater.models.Order;
import com.practice.theater.models.OrderPlace;
import com.practice.theater.models.PlayDate;
import com.practice.theater.models.User;
import com.practice.theater.models.xml.Category;
import com.practice.theater.models.xml.HallRow;
import com.practice.theater.repository.*;
import com.practice.web.dto.CompletedOrderDto;
import com.practice.web.dto.OrderDto;
import com.practice.web.dto.PlaceDto;
import com.practice.web.services.OrderService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;

import static java.util.stream.Collectors.*;

public class OrderServiceImpl implements OrderService {

    private static final Logger LOGGER = LogManager.getLogger(OrderServiceImpl.class);

    private final RepositoryFactory factory = ServiceLocator.getInstance().getRepositoryFactory();
    private final HallRowRepository rowRepository = factory.hallRowRepository();
    private final UserRepository userRepository = factory.userRepository();
    private final CategoryRepository categoryRepository = factory.categoryRepository();
    private final OrderRepository orderRepository = factory.orderRepository();
    private final OrderPlaceRepository placeRepository = factory.orderPlaceRepository();
    private final PlayDateRepository playDateRepository = factory.playDateRepository();

    @Override
    public CompletedOrderDto commitOrder(OrderDto dto, long userId) {
        List<PlaceDto> places = dto.getPlaces();
        if (places != null && !places.isEmpty()) {
            List<HallRow> rows = rowRepository.getById(places.get(0).getRowId())
                    .map(row -> rowRepository.getHallRowsByHallId(row.getHallId()))
                    .orElse(Collections.emptyList());
            if (checkCorrectPlaceNumber(places, rows)) {
                Order order = orderToDatabase(dto, rows, userId);
                if (order != null) {
                    return CompletedOrderDto.from(order);
                }
            }
        }
        return null;
    }

    @Override
    public List<CompletedOrderDto> actualOrders(long limit, long offset) {
        if (limit <= 0 || offset < 0) {
            return orderRepository.getNotConfirmedOrders().stream()
                    .map(CompletedOrderDto::from)
                    .collect(toList());
        }
        return orderRepository.getNotConfirmedOrders(limit, offset).stream()
                .map(CompletedOrderDto::from)
                .collect(toList());
    }

    private Order orderToDatabase(OrderDto dto, List<HallRow> rows, long userId) {
        Optional<Order> orderOpt = userRepository.getById(userId)
                .map(u -> createOrder(dto.getPlaces(), rows, u));
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            orderRepository.add(order);
            boolean success = playDateRepository.getById(dto.getDateId())
                    .map(date -> isAllPlacesSaved(dto.getPlaces(), order, date))
                    .orElse(false);
            if (!success) {
                orderRepository.remove(order);
                return null;
            }
            return order;
        }
        return null;
    }

    private Order createOrder(List<PlaceDto> places, List<HallRow> rows, User u) {
        Order order = new Order();
        order.setUser(u);
        order.setQuantity(places.size());
        Map<Long, HallRow> rowMap = rows.stream()
                .collect(toMap(HallRow::getId, Function.identity()));
        Map<Long, Category> categoryMap = categoryRepository.getAll().stream()
                .collect(toMap(Category::getId, Function.identity()));
        BigDecimal cost = places.stream()
                .map(place -> categoryMap.get(rowMap.get(place.getRowId()).getCategoryId()).getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setCost(cost);
        return order;
    }

    private boolean isAllPlacesSaved(List<PlaceDto> places, Order order, PlayDate date) {
        try {
            List<OrderPlace> orderPlaces = places.stream()
                    .map(p -> createOrderPlace(p, order, date))
                    .collect(toList());
            placeRepository.addAll(orderPlaces);
            return true;
        } catch (DatabaseException e) {
            LOGGER.error(e);
        }
        return false;
    }

    private static OrderPlace createOrderPlace(PlaceDto dto, Order order, PlayDate date) {
        OrderPlace place = new OrderPlace();
        place.setOrder(order);
        place.setDate(date);
        place.setRowId(dto.getRowId());
        place.setPlace(dto.getPlace());
        return place;
    }


    private static boolean checkCorrectPlaceNumber(List<PlaceDto> places, List<HallRow> rows) {
        HallRow row;
        Map<Long, HallRow> rowsMap = rows.stream()
                .collect(toMap(HallRow::getId, Function.identity()));

        for (PlaceDto place : places) {
            int skip = rows.stream()
                    .filter(r -> r.getId() < place.getRowId())
                    .mapToInt(HallRow::getCount).sum();
            row = rowsMap.get(place.getRowId());
            if (place.getPlace() <= skip || place.getPlace() > skip + row.getCount()) {
                LOGGER.debug(place.getPlace());
                return false;
            }
        }

        return true;
    }
}
