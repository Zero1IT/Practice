package com.practice.web.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.config.HttpMethod;
import com.practice.web.config.WebController;
import com.practice.web.config.WebParam;
import com.practice.web.config.WebRequest;
import com.practice.web.config.security.Authorize;
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
import java.util.function.ToLongFunction;

@WebController("/api/sign")
public class SignController {
    private static final Logger LOGGER = LogManager.getLogger(SignController.class);

    private final SignService signService = ServiceLocator.getInstance().getServiceFactory().signService();
    private final TokenService tokenService = ServiceLocator.getInstance().getServiceFactory().tokenService();

    @WebRequest(value = "/registration", method = HttpMethod.POST)
    public void registration(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        CredentialsValidator validator = new CredentialsValidator();
        checkUserValidityAndSendTokens(req, resp, validator, signService::saveUser);
    }

    @WebRequest(value = "/login", method = HttpMethod.POST)
    public void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        CredentialsValidator validator = new CredentialsValidator(false);
        checkUserValidityAndSendTokens(req, resp, validator, signService::findUser);
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

    @WebRequest(value = "/lang", method = HttpMethod.GET)
    public JsonNode stringResourcesClientLanguage(@WebParam("locale") String lang) {
        String language = lang == null ? "en" : lang;
        return WebUtils.getJsonLanguageResource(language);
    }

    @Authorize(Role.USER)
    @WebRequest(value = "/sign-out", method = HttpMethod.POST)
    public void deleteUserTokens(JwtPayload payload) {
        tokenService.deleteTokenByUserId(payload.getUserId());
    }

    private void checkUserValidityAndSendTokens(HttpServletRequest req, HttpServletResponse resp, CredentialsValidator validator,
                                                ToLongFunction<CredentialsDto> operation) throws IOException {
        Optional<CredentialsDto> dto = JsonUtils.parseRequest(req, CredentialsDto.class).filter(validator::isValid);
        if (dto.isPresent()) {
            long id = operation.applyAsLong(dto.get());
            if (id > 0) {
                WebUtils.updateAndSendJwsTokens(resp, new JwtPayload(id, dto.get().getRole()));
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    private void tryUpdateTokens(HttpServletResponse resp, String refreshToken) throws IOException {
        Claims claims = WebUtils.parseJwsPayload(refreshToken);
        if (claims != null) {
            long userId = claims.get(WebUtils.REFRESH_TOKEN_USER_ID, Long.class);
            Optional<String> oldRefreshToken = tokenService.findRefreshToken(userId);
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
