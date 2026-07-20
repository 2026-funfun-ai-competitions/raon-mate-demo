package com.raonmate.backend.venue.api;

import com.raonmate.backend.venue.infrastructure.GooglePlacesPhotoService;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PlacePhotoController {
    private final GooglePlacesPhotoService photoService;

    @GetMapping("/api/place-photos")
    public ResponseEntity<Void> photo(@RequestParam String name) {
        URI photoUri = photoService.resolve(name);
        return ResponseEntity.status(HttpStatus.FOUND).location(photoUri).build();
    }
}
