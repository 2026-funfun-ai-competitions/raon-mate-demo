package com.raonmate.backend.notification.api;

import com.raonmate.backend.notification.domain.NotificationChannel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationSendRequest(
        @NotNull NotificationChannel channel,
        @Min(1) @Max(500) int recipientCount,
        @NotBlank @Size(max = 1000) String message
) {}
