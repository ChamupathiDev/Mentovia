package com.mentovia.controller;

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

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/resources")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@Validated
public class LearningResourceController {
    private final LearningResourceService service;
    private final FileStorageService fileStorage;

    /**
     * List all resources
     */
    @GetMapping
    public List<LearningResourceDTO> list() {
        return service.getAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get by ID
     */
    @GetMapping("/{id}")
    public LearningResourceDTO get(@PathVariable String id) {
        return toDTO(service.getById(id));
    }

    /**
     * Create via JSON
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LearningResourceDTO> createJson(
            @RequestBody @Valid LearningResourceDTO dto
    ) {
        LearningResource r = dto.toEntity();
        LearningResource saved = service.create(r);
        return ResponseEntity.ok(toDTO(saved));
    }

    /**
     * Create with file upload
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LearningResourceDTO> createWithUpload(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam MultipartFile file
    ) {
        String filename = fileStorage.storeFile(file, type);
        LearningResource r = new LearningResource();
        r.setTitle(title);
        r.setDescription(description);
        r.setType(type);
        r.setMediaLink(filename);
        LearningResource saved = service.create(r);
        return ResponseEntity.ok(toDTO(saved));
    }

    /**
     * Update via JSON
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LearningResourceDTO> updateJson(
            @PathVariable String id,
            @RequestBody @Valid LearningResourceDTO dto
    ) {
        LearningResource existing = service.getById(id);
        existing.updateFromDto(dto);
        LearningResource updated = service.update(id, existing);
        return ResponseEntity.ok(toDTO(updated));
    }

    /**
     * Update with file upload
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LearningResourceDTO> updateWithUpload(
            @PathVariable String id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam(required = false) MultipartFile file
    ) {
        LearningResource existing = service.getById(id);
        existing.setTitle(title);
        existing.setDescription(description);
        existing.setType(type);

        if (file != null && !file.isEmpty()) {
            fileStorage.deleteFile(existing.getMediaLink(), existing.getType());
            String filename = fileStorage.storeFile(file, type);
            existing.setMediaLink(filename);
        }

        LearningResource updated = service.update(id, existing);
        return ResponseEntity.ok(toDTO(updated));
    }

    /**
     * Delete by ID
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Preview endpoint: inline display of PDFs and videos
     */
    @GetMapping("/file/{filename:.+}")
    public ResponseEntity<Resource> previewFile(@PathVariable String filename) {
        Resource file = fileStorage.loadAsResource(filename);
        String contentType = fileStorage.detectContentType(filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(file);
    }

    // --- Mapping helpers ---
    private LearningResourceDTO toDTO(LearningResource r) {
        LearningResourceDTO dto = new LearningResourceDTO();
        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setType(r.getType());
        dto.setMediaLink(r.getMediaLink());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
