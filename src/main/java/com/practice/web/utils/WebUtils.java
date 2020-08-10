package com.practice.web.utils;

import com.practice.business.ServiceLocator;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Properties;

public final class WebUtils {

    private static final Logger LOGGER = LogManager.getLogger(WebUtils.class);
    private static final Object lock = new Object();
    private static final String CLASS_PATH_DELIMITER = "/";
    private static String privateKey = null;

    public static void sendJsonResponse(HttpServletResponse response, String json) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.write(json);
        }
    }

    /**
     * Hash string with specific algorithm
     * @param algorithm - algorithm for do hash
     * @param str - string for hashing
     * @return hashed string
     */
    public static String hash(String algorithm, String str) {
        try {
            MessageDigest hasher = MessageDigest.getInstance(algorithm);
            byte[] hash = hasher.digest(str.getBytes(StandardCharsets.UTF_8));
            return new String(hash, StandardCharsets.UTF_8);
        } catch (NoSuchAlgorithmException e) {
            LOGGER.error(e);
            throw new IllegalArgumentException("Not found algorithm: " + algorithm);
        }
    }

    public static String getSecretKey() {
        if (privateKey == null) {
            try {
                String fileName = CLASS_PATH_DELIMITER + ServiceLocator.SETTINGS_FILE + ".properties";
                Properties properties = new Properties();
                properties.load(WebUtils.class.getResourceAsStream(fileName));
                if (properties.contains("key")) {
                    privateKey = properties.getProperty("key");
                } else {
                    createAndSaveKey(fileName, properties);
                }
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }
        return privateKey;
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

    /**
     * Hash string with SHA-256 algorithm
     * @param str - string for hashing
     * @return hashed string
     */
    public static String hash(String str) {
        return hash("SHA-256", str);
    }

    private WebUtils() {}
}
