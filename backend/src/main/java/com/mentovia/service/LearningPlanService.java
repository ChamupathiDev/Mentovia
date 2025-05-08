package com.mentovia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mentovia.dto.LearningPlanDTO;
import com.mentovia.model.LearningPlan;
import com.mentovia.model.Resource;
import com.mentovia.model.Week;
import com.mentovia.repository.LearningPlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    public LearningPlan createLearningPlan(LearningPlanDTO learningPlanDTO) {
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setTitle(learningPlanDTO.getTitle());
        learningPlan.setDescription(learningPlanDTO.getDescription());
        learningPlan.setResources(
            learningPlanDTO.getResources().stream()
            .map(resourceDTO -> {
                Resource resource = new Resource();
                resource.setTitle(resourceDTO.getTitle());
                resource.setUrl(resourceDTO.getUrl());
                resource.setType(resourceDTO.getType()); // Add this line
                return resource;
            })
                .toList()
        );
        learningPlan.setWeeks(
            learningPlanDTO.getWeeks().stream()
                .map(weekDTO -> {
                    Week week = new Week();
                    week.setTitle(weekDTO.getTitle());
                    week.setDescription(weekDTO.getDescription());
                    return week;
                })
                .toList()
        );
        return learningPlanRepository.save(learningPlan);
    }

    public LearningPlan updateLearningPlan(String id, LearningPlanDTO learningPlanDTO) {
        return learningPlanRepository.findById(id)
            .map(existingPlan -> {
                existingPlan.setTitle(learningPlanDTO.getTitle());
                existingPlan.setDescription(learningPlanDTO.getDescription());
    
                // Map Resources
                existingPlan.setResources(
                    learningPlanDTO.getResources().stream()
                        .map(resourceDTO -> {
                            Resource resource = new Resource();
                            resource.setTitle(resourceDTO.getTitle());
                            resource.setUrl(resourceDTO.getUrl());
                            resource.setType(resourceDTO.getType()); // ✅
                            return resource;
                        })
                        .toList()
                );
    
                // Map Weeks (WITH STATUS)
                existingPlan.setWeeks(
                    learningPlanDTO.getWeeks().stream()
                        .map(weekDTO -> {
                            Week week = new Week();
                            week.setTitle(weekDTO.getTitle());
                            week.setDescription(weekDTO.getDescription());
                            week.setStatus(weekDTO.getStatus()); // ✅
                            return week;
                        })
                        .toList()
                );
    
                return learningPlanRepository.save(existingPlan);
            })
            .orElseThrow(() -> new RuntimeException("LearningPlan not found"));
    }

    public void deleteLearningPlan(String id) {
        learningPlanRepository.deleteById(id);
    }
}