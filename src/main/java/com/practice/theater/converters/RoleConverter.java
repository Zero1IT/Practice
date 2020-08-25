package com.practice.theater.converters;

import com.practice.theater.db.annotations.Converter;
import com.practice.theater.models.Role;

public class RoleConverter implements Converter<Role, Integer> {
    @Override
    public Role convertTo(Integer obj) {
        return Role.values()[obj - 1];
    }

    @Override
    public Integer convertFrom(Role entity) {
        return entity.ordinal() + 1;
    }
}
