package com.mentovia.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mentovia.dto.LearningResourceDTO;

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

    /** used by controller#updateJson(...) and #updateWithUpload */
    public void updateFromDto(LearningResourceDTO dto) {
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.type = dto.getType();
        this.mediaLink = dto.getMediaLink();
        this.updatedAt = System.currentTimeMillis();
    }
}




