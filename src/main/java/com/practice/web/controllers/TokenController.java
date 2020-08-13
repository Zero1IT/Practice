package com.practice.web.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Role;
import com.practice.web.services.interfaces.TokenService;
import com.practice.web.context.WebController;
import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@WebController("/refresh-token")
public class TokenController implements Controller {
    @Override
    public void post(HttpServletRequest req, HttpServletResponse resp) throws IOException {
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
