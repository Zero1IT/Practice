package com.practice.web.validators;

import com.practice.business.ServiceLocator;
import com.practice.web.dto.CredentialsDto;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CredentialsValidatorTest {

    private final CredentialsValidator validator = new CredentialsValidator();
    private final CredentialsDto dto = new CredentialsDto();

    {
        dto.setEmail("email.account@gmail.com");
        dto.setPassword("10password_UP_pass");
        dto.setUsername("Chains_name");
        dto.setPhone("+375297618396");
    }

    @Test
    void isValidShouldBeTrue() {
        assertTrue(validator.isValid(dto));
        assertNull(validator.getLastErrorMessage());
    }

    @Test
    void shouldGiveErrorPasswordMessage() {
        dto.setPassword("dhfYdn2Bsj"); // special char doesn't exist
        assertFalse(validator.isValid(dto));
        assertEquals(
                String.format(ServiceLocator.getInstance().getMessage("validate.error.password"), dto.getPassword()),
                validator.getLastErrorMessage()
        );
    }

    @Test
    void shouldGiveErrorEmailMessage() {
        dto.setEmail("sdfh!dfh@gmail");
        assertFalse(validator.isValid(dto));
        assertEquals(
                String.format(ServiceLocator.getInstance().getMessage("validate.error.email"), dto.getEmail()),
                validator.getLastErrorMessage()
        );
    }

    @Test
    void shouldGiveErrorPhoneMessage() {
        dto.setPhone("34123");
        assertFalse(validator.isValid(dto));
        assertEquals(
                String.format(ServiceLocator.getInstance().getMessage("validate.error.phone"), dto.getPhone()),
                validator.getLastErrorMessage()
        );
    }

    @Test
    void shouldGiveErrorNicknameMessage() {
        dto.setUsername("0sobaka_red"); // starts with number
        assertFalse(validator.isValid(dto));
        assertEquals(
                String.format(ServiceLocator.getInstance().getMessage("validate.error.nickname"), dto.getUsername()),
                validator.getLastErrorMessage()
        );
    }
}
