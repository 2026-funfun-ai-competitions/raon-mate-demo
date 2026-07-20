package com.raonmate.backend.budget.api;

import com.raonmate.backend.budget.domain.BudgetPlan;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record BudgetResponse(
        UUID id,
        UUID workshopId,
        int expectedParticipants,
        BigDecimal budgetPerPerson,
        List<Item> items,
        BigDecimal totalAmount,
        BigDecimal estimatedPerPerson,
        BigDecimal limitAmount,
        BigDecimal remainingAmount,
        BigDecimal usagePercent,
        Instant updatedAt
) {
    public static BudgetResponse from(BudgetPlan plan) {
        int participants = plan.getWorkshop().getExpectedParticipants();
        BigDecimal perPersonLimit = plan.getWorkshop().getBudgetPerPerson() == null
                ? BigDecimal.ZERO : plan.getWorkshop().getBudgetPerPerson();
        BigDecimal limit = perPersonLimit.multiply(BigDecimal.valueOf(participants));
        BigDecimal total = plan.getItems().stream()
                .map(BudgetPlan.Item::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<Item> items = plan.getItems().stream()
                .map(item -> new Item(
                        item.getCategory(), item.getName(), item.getAmount(), item.getNote(),
                        divide(item.getAmount(), participants), percent(item.getAmount(), total)))
                .toList();
        return new BudgetResponse(
                plan.getId(), plan.getWorkshop().getId(), participants, perPersonLimit, items,
                total, divide(total, participants), limit, limit.subtract(total),
                percent(total, limit), plan.getUpdatedAt());
    }

    private static BigDecimal divide(BigDecimal amount, int divisor) {
        if (divisor <= 0) return BigDecimal.ZERO;
        return amount.divide(BigDecimal.valueOf(divisor), 0, RoundingMode.HALF_UP);
    }

    private static BigDecimal percent(BigDecimal amount, BigDecimal total) {
        if (total.signum() == 0) return BigDecimal.ZERO;
        return amount.multiply(BigDecimal.valueOf(100))
                .divide(total, 1, RoundingMode.HALF_UP);
    }

    public record Item(
            String category,
            String name,
            BigDecimal amount,
            String note,
            BigDecimal perPersonAmount,
            BigDecimal percentage
    ) {}
}
