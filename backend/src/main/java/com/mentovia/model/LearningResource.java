package com.mentovia.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "learning_resources")
public class LearningResource {
    @Id
    private String id;
    private String title;
    private String description;
    private String type;       // e.g. "PDF", "VIDEO", "GUIDE"
    private String mediaLink;  // URL to PDF or video
    private long createdAt;
    private long updatedAt;
}




