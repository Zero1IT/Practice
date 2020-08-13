package com.practice.web.controllers;

import com.practice.theater.ServiceLocator;
import com.practice.web.services.interfaces.SignService;
import com.practice.web.context.WebController;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import com.practice.web.validators.CredentialsValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@WebController("/registration")
public class RegistrationController implements Controller {

    private static final Logger LOGGER = LogManager.getLogger(RegistrationController.class);

    @Override
    public void post(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SignService service = ServiceLocator.getInstance().getServiceFactory().signService();
        CredentialsValidator validator = new CredentialsValidator();
        Optional<CredentialsDto> dto = JsonUtils.parseRequest(req, CredentialsDto.class)
                .filter(validator::isValid);
        if (dto.isPresent()) {
            long id = service.saveUser(dto.get());
            if (id > 0) {
                WebUtils.updateAndSendJwsTokens(resp, new JwtPayload(id, dto.get()));
            }
        } else {
            LOGGER.info("Credentials isn't valid");
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}
