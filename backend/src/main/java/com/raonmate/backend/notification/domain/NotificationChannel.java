package com.raonmate.backend.notification.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum NotificationChannel {
    SLACK,
    EMAIL;

    @JsonCreator
    public static NotificationChannel from(String value) {
        if (value == null) return null;
        if ("MESSENGER".equalsIgnoreCase(value)) return SLACK;
        try {
            return valueOf(value.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("지원하지 않는 알림 채널입니다: " + value);
        }
    }
}
