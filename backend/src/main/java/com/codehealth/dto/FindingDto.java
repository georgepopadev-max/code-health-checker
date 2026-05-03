package com.codehealth.dto;

import java.util.UUID;

public class FindingDto {
    private UUID id;
    private String severity;
    private String category;
    private String filePath;
    private Integer lineNumber;
    private String methodName;
    private String className;
    private String description;
    private Integer complexityScore;
    private Integer linesOfCode;
    private Integer effortHours;

    public FindingDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Integer getLineNumber() { return lineNumber; }
    public void setLineNumber(Integer lineNumber) { this.lineNumber = lineNumber; }

    public String getMethodName() { return methodName; }
    public void setMethodName(String methodName) { this.methodName = methodName; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getComplexityScore() { return complexityScore; }
    public void setComplexityScore(Integer complexityScore) { this.complexityScore = complexityScore; }

    public Integer getLinesOfCode() { return linesOfCode; }
    public void setLinesOfCode(Integer linesOfCode) { this.linesOfCode = linesOfCode; }

    public Integer getEffortHours() { return effortHours; }
    public void setEffortHours(Integer effortHours) { this.effortHours = effortHours; }
}