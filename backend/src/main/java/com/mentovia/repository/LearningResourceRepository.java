package com.mentovia.repository;

import com.mentovia.model.LearningResource;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningResourceRepository extends MongoRepository<LearningResource,String> { }


