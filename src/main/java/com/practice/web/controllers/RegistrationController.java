package com.practice.web.controllers;

import com.practice.business.ServiceLocator;
import com.practice.business.services.interfaces.SignService;
import com.practice.web.context.WebController;
import com.practice.web.dto.CredentialsDto;
import com.practice.web.dto.JwtPayload;
import com.practice.web.utils.JsonMappingUtils;
import com.practice.web.utils.WebUtils;
import com.practice.web.validators.CredentialsValidator;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Optional;

@WebController("/registration")
public class RegistrationController implements Controller {
    @Override
    public void post(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        SignService service = ServiceLocator.getInstance().getServiceFactory().signService();
        CredentialsValidator validator = new CredentialsValidator();
        Optional<CredentialsDto> dto = JsonMappingUtils.parseRequest(req, CredentialsDto.class).filter(validator::isValid);
        if (dto.isPresent()) {
            long id = service.saveUser(dto.get());
            if (id > 0) {
                HashMap<String, String> map = new HashMap<>();
                map.put("sign", jwt(new JwtPayload(id, dto.get())));
                String json = JsonMappingUtils.parseToJson(map).orElse("");
                WebUtils.sendJsonResponse(resp, json);
            }
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    private String jwt(Object payload) {
        return Jwts.builder()
                .setSubject(JsonMappingUtils.parseToJson(payload).orElse(""))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(WebUtils.getSecretKey())))
                .compact();
    }
}
