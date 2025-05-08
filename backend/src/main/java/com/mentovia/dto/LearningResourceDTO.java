package com.mentovia.dto;

import com.mentovia.model.LearningResource;

import lombok.Data;

@Data
public class LearningResourceDTO {
    private String id;
    private String title;
    private String description;
    private String type;
    private String mediaLink;
    private long createdAt;
    private long updatedAt;

    /** used by controller#createJson(...) */
    public LearningResource toEntity() {
        LearningResource r = new LearningResource();
        r.setTitle(this.title);
        r.setDescription(this.description);
        r.setType(this.type);
        r.setMediaLink(this.mediaLink);
        long now = System.currentTimeMillis();
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        return r;
    }

    
}


