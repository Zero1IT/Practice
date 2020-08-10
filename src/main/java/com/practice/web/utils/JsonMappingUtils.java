package com.practice.web.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

public final class JsonMappingUtils {

    private static final Logger LOGGER = LogManager.getLogger(JsonMappingUtils.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> Optional<T> parseRequest(HttpServletRequest req, Class<T> cl) throws IOException {
        try {
            return Optional.of(mapper.readValue(req.getReader(), cl));
        } catch (IOException e) {
            LOGGER.error(e);
            return Optional.empty();
        }
    }

    public static Optional<String> parseToJson(Object object) {
        try {
            return Optional.of(mapper.writeValueAsString(object));
        } catch (JsonProcessingException e) {
            LOGGER.error(e);
            return Optional.empty();
        }
    }

    private JsonMappingUtils() {}
}
