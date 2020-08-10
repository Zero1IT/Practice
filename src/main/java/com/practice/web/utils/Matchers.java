package com.practice.web.utils;

import java.util.regex.Pattern;

/**
 * Checks validation with reg-ex
 */
public final class Matchers {
    private static final Pattern password =
            Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%_*#?&])[A-Za-z\\d@$!%_*#?&]{8,}$");
    private static final Pattern nickname =
            Pattern.compile("^[^0-9_][\\w_]{4,32}$");
    private static final Pattern email =
            Pattern.compile("^([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+)\\.([a-zA-Z]{2,5})$");
    private static final Pattern phone =
            Pattern.compile("^\\+?\\d{4,5}\\d{7,8}$");


    public static boolean matchPassword(String str) {
        return match(password, str);
    }

    public static boolean matchNickname(String str) {
        return match(nickname, str);
    }

    public static boolean matchEmail(String str) {
        return match(email, str);
    }

    public static boolean matchPhone(String str) {
        return match(phone, str);
    }

    private static boolean match(Pattern pattern, String str) {
        return pattern.asPredicate().test(str);
    }

    private Matchers() {}
}
