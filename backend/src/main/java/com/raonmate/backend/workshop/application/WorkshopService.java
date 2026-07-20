package com.raonmate.backend.workshop.application;

import com.raonmate.backend.global.error.ResourceNotFoundException;
import com.raonmate.backend.workshop.api.WorkshopCreateRequest;
import com.raonmate.backend.workshop.api.WorkshopResponse;
import com.raonmate.backend.workshop.domain.Workshop;
import com.raonmate.backend.workshop.domain.WorkshopRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WorkshopService {
    private final WorkshopRepository workshopRepository;

    @Transactional
    public WorkshopResponse create(WorkshopCreateRequest request) {
        Workshop workshop = new Workshop(request.title(), request.departureLocation(),
                request.expectedParticipants(), request.budgetPerPerson(), request.responseDeadline(),
                request.requiredConditions());
        return WorkshopResponse.from(workshopRepository.save(workshop));
    }

    public WorkshopResponse get(UUID id) { return WorkshopResponse.from(find(id)); }

    public List<WorkshopResponse> findAll() {
        return workshopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(WorkshopResponse::from).toList();
    }

    public Workshop find(UUID id) {
        return workshopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("워크숍을 찾을 수 없습니다."));
    }
}
