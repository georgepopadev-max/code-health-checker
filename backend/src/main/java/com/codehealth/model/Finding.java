package com.codehealth.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "findings")
public class Finding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_report_id", nullable = false)
    private HealthReport healthReport;

    @Enumerated(EnumType.STRING)
    private FindingSeverity severity;

    @Enumerated(EnumType.STRING)
    private FindingCategory category;

    @Column(name = "file_path")
    private String filePath;

    private Integer lineNumber;

    private String methodName;

    private String className;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "complexity_score")
    private Integer complexityScore;

    private Integer linesOfCode;

    @Column(name = "effort_hours")
    private Integer effortHours;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public HealthReport getHealthReport() { return healthReport; }
    public void setHealthReport(HealthReport healthReport) { this.healthReport = healthReport; }

    public FindingSeverity getSeverity() { return severity; }
    public void setSeverity(FindingSeverity severity) { this.severity = severity; }

    public FindingCategory getCategory() { return category; }
    public void setCategory(FindingCategory category) { this.category = category; }

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

    public enum FindingSeverity {
        CRITICAL, MAJOR, MINOR, INFO
    }

    public enum FindingCategory {
        COMPLEXITY, DUPLICATION, COVERAGE, DOCUMENTATION, SECURITY, ARCHITECTURE, DEPENDENCY
    }
}