package com.raonmate.backend.planner;

import static org.junit.jupiter.api.Assertions.*;
import com.raonmate.backend.budget.application.BudgetService;
import com.raonmate.backend.notification.api.NotificationSendRequest;
import com.raonmate.backend.notification.domain.NotificationChannel;
import com.raonmate.backend.notification.infrastructure.SlackNotificationSender;
import com.raonmate.backend.notification.application.NotificationService;
import com.raonmate.backend.schedule.api.ScheduleRequest;
import com.raonmate.backend.schedule.application.ScheduleService;
import com.raonmate.backend.schedule.application.ScheduleGenerator;
import com.raonmate.backend.workshop.api.*;
import com.raonmate.backend.workshop.application.WorkshopService;
import com.raonmate.backend.workshop.domain.WorkshopType;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:planner-test;DB_CLOSE_DELAY=-1","spring.jpa.hibernate.ddl-auto=create-drop"})
@Transactional @RequiredArgsConstructor
@TestConstructor(autowireMode=TestConstructor.AutowireMode.ALL)
class WorkshopPlannerFlowTests {
 private final WorkshopService workshops; private final ScheduleService schedules;
 private final BudgetService budgets; private final NotificationService notifications;
 @MockitoBean private SlackNotificationSender slackNotificationSender;
 @MockitoBean private ScheduleGenerator scheduleGenerator;
 @Test void completesDemoPlannerFlow(){
  var w=workshops.create(new WorkshopCreateRequest("기술본부 워크숍","서울 근교",25,new BigDecimal("150000"),null,"팀빌딩",WorkshopType.OVERNIGHT,LocalDate.of(2026,9,9),LocalDate.of(2026,9,10),"소통 강화"));
  assertEquals(WorkshopType.OVERNIGHT,w.workshopType());
  var updated=workshops.update(w.id(),new WorkshopUpdateRequest("기술본부 워크숍","가평",25,new BigDecimal("150000"),WorkshopType.OVERNIGHT,LocalDate.of(2026,9,9),LocalDate.of(2026,9,10),"목표 공유","바비큐"));
  assertEquals("가평",updated.preferredRegion());
  assertEquals("서울 근교",updated.departureLocation());
  var schedule=schedules.generate(w.id()); assertTrue(schedule.items().size()>=8);
  assertThrows(IllegalArgumentException.class,()->schedules.update(w.id(),new ScheduleRequest(List.of(
    new ScheduleRequest.Item(LocalDate.of(2026,9,9),LocalTime.of(10,0),LocalTime.of(12,0),"SESSION","A",null),
    new ScheduleRequest.Item(LocalDate.of(2026,9,9),LocalTime.of(11,0),LocalTime.of(13,0),"SESSION","B",null)))));
  var budget=budgets.initialize(w.id()); assertEquals(0,new BigDecimal("3750000").compareTo(budget.limitAmount())); assertEquals(0,new BigDecimal("170000").compareTo(budget.remainingAmount())); assertEquals(6,budget.items().size());
  org.mockito.Mockito.when(slackNotificationSender.channel()).thenReturn(NotificationChannel.SLACK);
  var sent=notifications.send(w.id(),new NotificationSendRequest(NotificationChannel.SLACK,25,"일정이 확정되었습니다.")); assertEquals("SENT",sent.status()); assertEquals(1,notifications.list(w.id()).size());
 }
}
