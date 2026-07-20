package com.raonmate.backend.global.error;

public class ExternalNotificationServiceException extends RuntimeException {
    public ExternalNotificationServiceException(String message) { super(message); }
    public ExternalNotificationServiceException(String message, Throwable cause) { super(message, cause); }
}
