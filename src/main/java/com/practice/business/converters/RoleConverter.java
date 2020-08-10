package com.practice.business.converters;

import com.practice.business.db.annotations.Converter;
import com.practice.business.models.Role;

/**
 * date: 8/3/2020
 * project: PracticeTask
 *
 * @author Alex
 */
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
