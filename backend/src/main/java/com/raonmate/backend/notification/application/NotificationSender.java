package com.raonmate.backend.notification.application;

import com.raonmate.backend.notification.domain.NotificationChannel;

public interface NotificationSender {
    NotificationChannel channel();
    void send(Command command);

    record Command(String workshopTitle, int recipientCount, String message) {}
}
