package com.raonmate.backend.notification.application;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.notification.api.NotificationResponse;
import com.raonmate.backend.notification.api.NotificationSendRequest;
import com.raonmate.backend.notification.domain.NotificationChannel;
import com.raonmate.backend.notification.domain.WorkshopNotification;
import com.raonmate.backend.notification.domain.WorkshopNotificationRepository;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {
    private final WorkshopRepository workshops;
    private final WorkshopNotificationRepository notifications;
    private final List<NotificationSender> senderList;

    public List<NotificationResponse> list(UUID id) {
        if (!workshops.existsById(id)) throw new ResourceNotFoundException("워크숍을 찾을 수 없습니다.");
        return notifications.findAllByWorkshopIdOrderBySentAtDesc(id).stream()
                .map(NotificationResponse::from).toList();
    }

    @Transactional
    public NotificationResponse send(UUID id, NotificationSendRequest request) {
        Workshop workshop = workshops.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
        NotificationSender sender = senders().get(request.channel());
        if (sender == null) {
            throw new IllegalArgumentException(request.channel() + " 알림 채널은 아직 연동되지 않았습니다.");
        }
        sender.send(new NotificationSender.Command(
                workshop.getTitle(), request.recipientCount(), request.message()));
        return NotificationResponse.from(notifications.save(new WorkshopNotification(
                workshop, request.channel().name(), request.recipientCount(), request.message())));
    }

    private Map<NotificationChannel, NotificationSender> senders() {
        Map<NotificationChannel, NotificationSender> result = new EnumMap<>(NotificationChannel.class);
        senderList.forEach(sender -> result.put(sender.channel(), sender));
        return result;
    }
}
