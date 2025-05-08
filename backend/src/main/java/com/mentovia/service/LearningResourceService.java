package com.mentovia.service;

import com.mentovia.model.LearningResource;
import com.mentovia.repository.LearningResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningResourceService {
    private final LearningResourceRepository repo;

    public LearningResource create(LearningResource r) {
        long now = Instant.now().toEpochMilli();
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        return repo.save(r);
    }
    public LearningResource update(String id, LearningResource r) {
        return repo.findById(id).map(existing -> {
            existing.setTitle(r.getTitle());
            existing.setDescription(r.getDescription());
            existing.setType(r.getType());
            existing.setMediaLink(r.getMediaLink());
            existing.setUpdatedAt(Instant.now().toEpochMilli());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Resource not found"));
    }
    public void delete(String id) { repo.deleteById(id); }
    public LearningResource getById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }
    public List<LearningResource> getAll() { return repo.findAll(); }
}




