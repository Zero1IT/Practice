package com.practice.web.validators;

import com.practice.theater.ServiceLocator;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.utils.Matchers;
import org.jetbrains.annotations.NotNull;

public class CredentialsValidator implements Validator<CredentialsDto> {

    private static final String[] MESSAGE_KEYS = {
            "validate.error.email",  "validate.error.password",
            "validate.error.nickname",  "validate.error.phone"
    };

    private final boolean isFull;
    private String message;

    public CredentialsValidator() {
        this(true);
    }

    public CredentialsValidator(boolean fullCheck) {
        isFull = fullCheck;
    }

    @Override
    public boolean isValid(CredentialsDto item) {
        String[] values = getValues(item);
        boolean[] tests = getTests(values);
        int index = 0;

        while (index < tests.length && tests[index]) index++; // -_-

        if (index != tests.length) {
            setMessage(ServiceLocator.getInstance().getMessage(MESSAGE_KEYS[index]), values[index]);
        }

        return index == tests.length;
    }

    // order equals MESSAGE_KEYS array
    @NotNull
    private String[] getValues(CredentialsDto item) {
        if (isFull) {
            return new String[]{
                    item.getEmail(), item.getPassword(),
                    item.getUsername(), item.getPhone()
            };
        } else {
            return new String[]{
                    item.getEmail(), item.getPassword()
            };
        }
    }

    // order equals getValues() array
    @NotNull
    private boolean[] getTests(String[] values) {
        if (isFull) {
            return new boolean[]{
                    Matchers.matchEmail(values[0]), Matchers.matchPassword(values[1]),
                    Matchers.matchNickname(values[2]), Matchers.matchPhone(values[3])
            };
        } else {
            return new boolean[]{
                    Matchers.matchEmail(values[0]), Matchers.matchPassword(values[1])
            };
        }
    }

    private void setMessage(String format, String str) {
        message = String.format(format, str);
    }

    @Override
    public String getLastErrorMessage() {
        return message;
    }
}
