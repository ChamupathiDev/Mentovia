// src/main/java/com/mentovia/controller/LearningResourceController.java
package com.mentovia.controller;

import com.mentovia.dto.LearningResourceCreateDTO;
import com.mentovia.dto.LearningResourceDTO;
import com.mentovia.model.LearningResource;
import com.mentovia.service.FileStorageService;
import com.mentovia.service.LearningResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
@Validated
public class LearningResourceController {
    private final LearningResourceService service;
    private final FileStorageService fileStorage;

    @GetMapping
    public List<LearningResourceDTO> list() {
        return service.getAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LearningResourceDTO get(@PathVariable String id) {
        return toDTO(service.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<LearningResourceDTO> createWithUpload(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam MultipartFile file
    ) {
        // storeFile returns the stored filename
        String filename = fileStorage.storeFile(file, type);
        LearningResource r = new LearningResource();
        r.setTitle(title);
        r.setDescription(description);
        r.setType(type);
        r.setMediaLink(filename);
        LearningResource saved = service.create(r);
        return ResponseEntity.ok(toDTO(saved));
    }


    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource file = fileStorage.loadAsResource(filename);
        String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET")
                .body(file);
    }

    // Update the existing PUT endpoint
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<LearningResourceDTO> update(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam(required = false) MultipartFile file) {

        LearningResource existing = service.getById(id);
        existing.setTitle(title);
        existing.setDescription(description);
        existing.setType(type);

        if (file != null && !file.isEmpty()) {
            // Remove old file
            fileStorage.deleteFile(existing.getMediaLink(), existing.getType());
            // Store new file
            String filename = fileStorage.storeFile(file, type);
            existing.setMediaLink(filename);
        }

        LearningResource updated = service.update(id, existing);
        return ResponseEntity.ok(toDTO(updated));
    }

// Remove the old PUT mapping that uses @RequestBody

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Mapping helpers
    private LearningResourceDTO toDTO(LearningResource r) {
        LearningResourceDTO dto = new LearningResourceDTO();
        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setType(r.getType());
        dto.setMediaLink(r.getMediaLink());  // filename only
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    private LearningResource fromCreateDTO(LearningResourceCreateDTO dto) {
        LearningResource r = new LearningResource();
        r.setTitle(dto.getTitle());
        r.setDescription(dto.getDescription());
        r.setType(dto.getType());
        r.setMediaLink(dto.getMediaLink());
        return r;
    }
}

