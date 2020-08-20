package com.practice.web.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.Optional;

public final class JsonUtils {

    private static final Logger LOGGER = LogManager.getLogger(JsonUtils.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> Optional<T> parseRequest(HttpServletRequest req, Class<T> cl) {
        try {
            return Optional.of(mapper.readValue(req.getReader(), cl));
        } catch (IOException e) {
            LOGGER.error(e);
            return Optional.empty();
        }
    }

    public static <T> Optional<T> parseRequest(HttpServletRequest req, TypeReference<T> type) {
        try {
            return Optional.of(mapper.readValue(req.getReader(), type));
        } catch (IOException e) {
            LOGGER.error(e);
            return Optional.empty();
        }
    }

    public static String toJson(Object object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            LOGGER.error(e);
            return "";
        }
    }

    public static <T> Optional<T> fromJson(String json, Class<T> cl) {
        try {
            return Optional.of(mapper.readValue(json, cl));
        } catch (IOException e) {
            LOGGER.error(e);
            return Optional.empty();
        }
    }

    public static JsonNode asJsonNode(InputStream stream) throws IOException {
        return mapper.readValue(stream, JsonNode.class);
    }

    private JsonUtils() {}
}
