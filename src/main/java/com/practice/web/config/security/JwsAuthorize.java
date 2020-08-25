package com.practice.web.config.security;

import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.practice.web.config.security.AuthAccess.*;

public class JwsAuthorize implements WebAuthorize<JwtPayload> {

    @Override
    public AuthAccess allowAccess(HttpServletRequest req, HttpServletResponse resp, Authorize authorize) {
        return  WebUtils.getAuthenticationHeader(req)
                .map(jws -> canAccess(jws, authorize))
                .orElse(UNAUTHORIZED);
    }

    @Override
    public JwtPayload getAuthentication(HttpServletRequest req, HttpServletResponse resp) {
        return WebUtils.getAuthenticationHeader(req)
                .map(WebUtils::parseJwsPayload)
                .flatMap(claims -> JsonUtils.fromJson(claims.getSubject(), JwtPayload.class))
                .orElse(null);
    }

    private static AuthAccess canAccess(String jws, Authorize authorize) {
        Claims claims = WebUtils.parseJwsPayload(jws);
        if (claims != null) {
            return JsonUtils.fromJson(claims.getSubject(), JwtPayload.class)
                    .filter(jwt -> jwt.getRole().compareTo(authorize.value()) >= 0)
                    .map(jwt -> ALLOW_ACCESS)
                    .orElse(PREVENT_ACCESS);
        }
        return UNAUTHORIZED;
    }
}
