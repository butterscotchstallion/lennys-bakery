package com.loco.service;

import java.text.Normalizer;

public class UrlSafeStringGenerator {
    public static String generateUrlSafeString(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name parameter must not be null or empty.");
        }

        // Normalize the name to remove accents and special characters
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", ""); // Remove diacritics

        // Keep only URL-safe characters: letters, numbers, '-', '_', '.', '~'
        String urlSafe = normalized.replaceAll("[^a-zA-Z0-9-_~.]", "");

        // Limit the length to a maximum of 25 characters
        if (urlSafe.length() > 25) {
            urlSafe = urlSafe.substring(0, 25);
        }

        return urlSafe;
    }
}