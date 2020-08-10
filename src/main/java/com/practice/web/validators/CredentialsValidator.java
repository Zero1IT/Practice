package com.practice.web.validators;

import com.practice.business.ServiceLocator;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.utils.Matchers;

public class CredentialsValidator implements Validator<CredentialsDto> {

    private static final String[] MESSAGE_KEYS = {
            "validate.error.email", "validate.error.phone",
            "validate.error.nickname", "validate.error.password"
    };

    private String message;

    @Override
    public boolean isValid(CredentialsDto item) {
        // order equals MESSAGE_KEYS array
        String[] values = {item.getEmail(), item.getPhone(), item.getUsername(), item.getPassword()};
        boolean[] tests = {
                Matchers.matchEmail(values[0]), Matchers.matchPhone(values[1]),
                Matchers.matchNickname(values[2]), Matchers.matchPassword(values[3])
        };

        int index = 0;
        while (index < tests.length && tests[index]) index++; // -_- .!.

        if (index != tests.length) {
            setMessage(ServiceLocator.getInstance().getMessage(MESSAGE_KEYS[index]), values[index]);
        }

        return index == tests.length;
    }

    private void setMessage(String format, String str) {
        message = String.format(format, str);
    }

    @Override
    public String getLastErrorMessage() {
        return message;
    }
}
