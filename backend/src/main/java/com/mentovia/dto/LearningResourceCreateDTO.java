package com.mentovia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LearningResourceCreateDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String type;

    private String mediaLink;
}
