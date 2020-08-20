package com.practice.web.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.practice.theater.ServiceLocator;
import com.practice.web.config.WebParam;
import com.practice.web.dto.JwtPayload;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jetbrains.annotations.Nullable;

import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Key;
import java.util.*;
import java.util.concurrent.TimeUnit;

public final class WebUtils {

    private static final Logger LOGGER = LogManager.getLogger(WebUtils.class);
    private static final Object lock = new Object();
    private static final String CLASS_PATH_DELIMITER = "/";
    private static final String AUTH_HEADER_TYPE = "Bearer";
    private static String privateKey = null;

    public static final String REFRESH_TOKEN_USER_ID = "user_id";
    public static final String ACCESS_TOKEN = "access";
    public static final String REFRESH_TOKEN = "refresh";

    public static void sendJsonResponse(HttpServletResponse response, String json) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.write(json);
        }
    }

    /**
     * Creates jwt tokens for access and refresh
     * @param payload - payload for access token
     * @return map with two keys (access {@see WebUtils.ACCESS_TOKEN}, refresh {@see WebUtils.REFRESH_TOKEN})
     */
    public static Map<String, String> createJwtTokens(JwtPayload payload) {
        Map<String, String> tokens = new HashMap<>();
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(WebUtils.getSecretKey()));
        String access = Jwts.builder()
                .setExpiration(getExpirationDate(0, 1))
                .setSubject(JsonUtils.toJson(payload))
                .signWith(key)
                .compact();
        String refresh = Jwts.builder()
                .claim(REFRESH_TOKEN_USER_ID, payload.getUserId())
                .setExpiration(getExpirationDate(30, 0))
                .signWith(key)
                .compact();
        tokens.put(ACCESS_TOKEN, access);
        tokens.put(REFRESH_TOKEN, refresh);
        return tokens;
    }

    @Nullable
    public static Claims parseJwsPayload(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(WebUtils.getSecretKey())))
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody();
        } catch (JwtException e) {
            LOGGER.error(e);
            return null;
        }
    }

    public static Date getExpirationDate(int days, int hours) {
        Date date = new Date();
        date.setTime(date.getTime() + TimeUnit.DAYS.toMillis(days) + TimeUnit.HOURS.toMillis(hours));
        return date;
    }

    public static void updateAndSendJwsTokens(HttpServletResponse resp, JwtPayload payload) throws IOException {
        Map<String, String> tokens = WebUtils.createJwtTokens(payload);
        String json = JsonUtils.toJson(tokens);
        ServiceLocator.getInstance().getServiceFactory().tokenService()
                .saveRefreshToken(payload.getUserId(), tokens.get("refresh"));
        WebUtils.sendJsonResponse(resp, json);
    }

    public static String getSecretKey() {
        if (privateKey == null) {
            try {
                String fileName = CLASS_PATH_DELIMITER + ServiceLocator.SETTINGS_FILE + ".properties";
                Properties properties = new Properties();
                properties.load(WebUtils.class.getResourceAsStream(fileName));
                if (properties.containsKey("key")) {
                    privateKey = properties.getProperty("key");
                } else {
                    createAndSaveKey(fileName, properties);
                }
            } catch (IOException | URISyntaxException e) {
                LOGGER.error(e);
                throw new RuntimeException(e);
            }
        }
        return privateKey;
    }

    public static Optional<String> getAuthenticationHeader(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null) {
            authorization = request.getHeader("x-access-token");
        } else if (authorization.startsWith(AUTH_HEADER_TYPE)) {
            authorization = authorization.substring(AUTH_HEADER_TYPE.length());
        }
        return authorization != null ? Optional.of(authorization.trim()) : Optional.empty();
    }

    private static void createAndSaveKey(String fileName, Properties properties) throws IOException, URISyntaxException {
        synchronized (lock) {
            String key = privateKey;
            if (key == null) {
                SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
                key = Encoders.BASE64.encode(secretKey.getEncoded());
                properties.setProperty("key", key);
                privateKey = key;
                try (OutputStream outputStream = Files.newOutputStream(Paths.get(WebUtils.class.getResource(fileName).toURI()))) {
                    properties.store(outputStream, null);
                }
            }
        }
    }

    public static JsonNode getJsonLanguageResource(String language) {
        String file = String.format("/locale/client_strings_%s.json", language.toLowerCase());
        try (InputStream stream = WebUtils.class.getResourceAsStream(file)) {
            return JsonUtils.asJsonNode(stream);
        } catch (IOException e) {
            LOGGER.error(e);
            return null;
        }
    }

    private WebUtils() {}
}
