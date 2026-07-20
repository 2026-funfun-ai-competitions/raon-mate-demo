package com.raonmate.backend.notification.infrastructure;

import com.raonmate.backend.global.error.ExternalNotificationServiceException;
import com.raonmate.backend.notification.application.NotificationSender;
import com.raonmate.backend.notification.domain.NotificationChannel;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class SlackNotificationSender implements NotificationSender {
    private final RestClient restClient;
    private final String webhookUrl;

    public SlackNotificationSender(@Value("${app.notification.slack.webhook-url:}") String webhookUrl) {
        this.restClient = RestClient.create();
        this.webhookUrl = webhookUrl;
    }

    @Override
    public NotificationChannel channel() { return NotificationChannel.SLACK; }

    @Override
    public void send(Command command) {
        if (webhookUrl == null || webhookUrl.isBlank()) {
            throw new ExternalNotificationServiceException("SLACK_WEBHOOK_URL이 설정되지 않았습니다.");
        }
        String text = "*[워크숍 알림] " + command.workshopTitle() + "*\n"
                + command.message() + "\n_대상 인원: " + command.recipientCount() + "명_";
        try {
            String response = restClient.post().uri(webhookUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("text", text))
                    .retrieve().body(String.class);
            if (response == null || !"ok".equalsIgnoreCase(response.trim())) {
                throw new ExternalNotificationServiceException("Slack이 발송 성공 응답을 반환하지 않았습니다.");
            }
        } catch (ExternalNotificationServiceException exception) {
            throw exception;
        } catch (RestClientException exception) {
            throw new ExternalNotificationServiceException("Slack 알림 발송에 실패했습니다.", exception);
        }
    }
}
