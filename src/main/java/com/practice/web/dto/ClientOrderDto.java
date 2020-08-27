package com.practice.web.dto;

import java.util.List;

public class ClientOrderDto {
    private long dateId;
    private List<PlaceDto> places;
    private boolean internetPayment;

    public long getDateId() {
        return dateId;
    }

    public void setDateId(long dateId) {
        this.dateId = dateId;
    }

    public List<PlaceDto> getPlaces() {
        return places;
    }

    public void setPlaces(List<PlaceDto> places) {
        this.places = places;
    }

    public boolean isInternetPayment() {
        return internetPayment;
    }

    public void setInternetPayment(boolean internetPayment) {
        this.internetPayment = internetPayment;
    }
}
