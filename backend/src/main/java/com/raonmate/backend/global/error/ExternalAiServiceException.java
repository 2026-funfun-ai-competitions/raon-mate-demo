package com.raonmate.backend.global.error;

public class ExternalAiServiceException extends RuntimeException {
    public ExternalAiServiceException(String message) {
        super(message);
    }

    public ExternalAiServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
