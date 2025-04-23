package com.mentovia.dto;

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
}