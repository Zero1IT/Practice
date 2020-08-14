package com.practice.web.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.context.HttpMethod;
import com.practice.web.context.WebController;
import com.practice.web.context.WebRequest;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.dto.JwtPayload;
import com.practice.web.services.interfaces.SignService;
import com.practice.web.services.interfaces.TokenService;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import com.practice.web.validators.CredentialsValidator;
import io.jsonwebtoken.Claims;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@WebController("/sign")
public class SignController {
    private static final Logger LOGGER = LogManager.getLogger(SignController.class);

    @WebRequest(value = "/registration", method = HttpMethod.POST)
    public void registration(HttpServletRequest req, HttpServletResponse resp) throws IOException {
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

    @WebRequest(value = "/login", method = HttpMethod.POST)
    public void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SignService service = ServiceLocator.getInstance().getServiceFactory().signService();
        CredentialsValidator validator = new CredentialsValidator(false);
        Optional<CredentialsDto> dto = JsonUtils.parseRequest(req, CredentialsDto.class).filter(validator::isValid);
        if (dto.isPresent()) {
            long id = service.findUser(dto.get());

        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    @WebRequest(value = "/refresh-token", method = HttpMethod.POST)
    public void refreshToken(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Optional<Map<String, String>> map = JsonUtils.parseRequest(req, new TypeReference<Map<String, String>>() {});
        if (map.isPresent()) {
            String token = map.get().getOrDefault("token", "");
            if (!token.isEmpty()) {
                tryUpdateTokens(resp, token);
            } else {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Field token is absent");
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Body is absent");
        }
    }

    private void tryUpdateTokens(HttpServletResponse resp, String refreshToken) throws IOException {
        Claims claims = WebUtils.parseJwsPayload(refreshToken);
        if (claims != null) {
            long userId = claims.get(WebUtils.REFRESH_TOKEN_USER_ID, Long.class);
            TokenService service = ServiceLocator.getInstance().getServiceFactory().tokenService();
            Optional<String> oldRefreshToken = service.findRefreshToken(userId);
            if (oldRefreshToken.isPresent() && oldRefreshToken.get().equals(refreshToken)) {
                Role role = ServiceLocator.getInstance().getServiceFactory().userService().getUserRole(userId);
                WebUtils.updateAndSendJwsTokens(resp, new JwtPayload(userId, role));
            } else {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect refreshToken");
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Incorrect refreshToken");
        }
    }
}
