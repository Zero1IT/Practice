package com.practice.business.db.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Constraint {
    /**
     * Should be equals column name of referenced table.
     * @return column name of referenced table
     */
    String mappedBy();
}
