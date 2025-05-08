package com.mentovia.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class WeekDTO {
    @NotBlank(message = "Week title is required")
    private String title;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;
}