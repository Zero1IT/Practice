package com.practice.business.services.interfaces;

import com.practice.web.dto.CredentialsDto;

public interface SignService {
    /**
     * Save user to database
     * @param dto - object with user info
     * @return user id if save is successful, otherwise 0
     */
    long saveUser(CredentialsDto dto);

    /**
     * Find registered user and return user's id.
     * Fill fields in dto
     * @param dto - account information, email and password is required
     * @return user's id
     */
    long findUser(CredentialsDto dto);
}
