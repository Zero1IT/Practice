package com.practice.web.api;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.config.WebController;
import com.practice.web.config.WebParam;
import com.practice.web.config.WebRequest;
import com.practice.web.config.security.Authorize;
import com.practice.web.dto.JwtPayload;
import com.practice.web.dto.UserDto;
import com.practice.web.services.interfaces.UserService;

import java.util.List;

@WebController("/api/users")
public class UserController {

    private final UserService service = ServiceLocator.getInstance().getServiceFactory().userService();

    @WebRequest
    @Authorize(Role.ADMIN)
    public List<UserDto> getAllUsers(@WebParam("id") String id) {
        return service.getUsersListOrSingle(id != null ? Long.parseLong(id) : 0);
    }

    @WebRequest("/info")
    @Authorize(Role.USER)
    public UserDto getCurrentUser(JwtPayload payload) {
        return service.getUsersListOrSingle(payload.getUserId()).get(0);
    }
}
