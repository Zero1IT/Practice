package com.practice.web.controllers;

import com.practice.theater.ServiceLocator;
import com.practice.web.services.interfaces.SignService;
import com.practice.web.context.WebController;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.utils.JsonUtils;
import com.practice.web.validators.CredentialsValidator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@WebController("/login")
public class LoginController implements Controller {
    @Override
    public void post(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SignService service = ServiceLocator.getInstance().getServiceFactory().signService();
        CredentialsValidator validator = new CredentialsValidator(false);
        Optional<CredentialsDto> dto = JsonUtils.parseRequest(req, CredentialsDto.class).filter(validator::isValid);
        if (dto.isPresent()) {
            long id = service.findUser(dto.get());

        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}
