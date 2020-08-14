package com.practice.theater;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class Utils {

    private static final Logger LOGGER = LogManager.getLogger(Utils.class);

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

    /**
     * Hash string with SHA-256 algorithm
     * @param str - string for hashing
     * @return hashed string
     */
    public static String hash(String str) {
        return hash("SHA-256", str);
    }

    public static String capitalize(String str) {
        if (str != null && str.length() != 0) {
            char[] chars = str.toCharArray();
            chars[0] = Character.toUpperCase(chars[0]);
            return new String(chars);
        } else {
            return str;
        }
    }

    private Utils() {}
}
