package com.practice.web.config.security;

import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonUtils;
import com.practice.web.utils.WebUtils;
import io.jsonwebtoken.Claims;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwsAuthorize implements WebAuthorize<JwtPayload> {

    @Override
    public boolean allowAccess(HttpServletRequest req, HttpServletResponse resp, Authorize authorize) {
        return  WebUtils.getAuthenticationHeader(req)
                .map(jws -> isCanAccess(jws, authorize))
                .orElse(false);
    }

    @Override
    public JwtPayload getAuthentication(HttpServletRequest req, HttpServletResponse resp) {
        return WebUtils.getAuthenticationHeader(req)
                .map(WebUtils::parseJwsPayload)
                .flatMap(claims -> JsonUtils.fromJson(claims.getSubject(), JwtPayload.class))
                .orElse(null);
    }

    private boolean isCanAccess(String jws, Authorize authorize) {
        Claims claims = WebUtils.parseJwsPayload(jws);
        if (claims != null) {
            return JsonUtils.fromJson(claims.getSubject(), JwtPayload.class)
                    .map(jwt -> jwt.getRole().compareTo(authorize.value()) >= 0)
                    .orElse(false);
        }
        return false;
    }
}
