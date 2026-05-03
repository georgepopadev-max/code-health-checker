package com.codehealth.dto;

import java.util.UUID;

public class RecommendationDto {
    private UUID id;
    private Integer priority;
    private String title;
    private String description;
    private String category;
    private Integer estimatedHours;
    private Integer healthScoreImpact;
    private String targetFile;

    public RecommendationDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }

    public Integer getHealthScoreImpact() { return healthScoreImpact; }
    public void setHealthScoreImpact(Integer healthScoreImpact) { this.healthScoreImpact = healthScoreImpact; }

    public String getTargetFile() { return targetFile; }
    public void setTargetFile(String targetFile) { this.targetFile = targetFile; }
}