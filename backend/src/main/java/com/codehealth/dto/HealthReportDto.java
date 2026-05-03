package com.codehealth.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class HealthReportDto {
    private UUID id;
    private UUID analysisRunId;
    private Integer overallScore;
    private Integer coverageScore;
    private Integer complexityScore;
    private Integer duplicationScore;
    private Integer documentationScore;
    private Integer securityScore;
    private Integer maintainabilityScore;
    private Integer totalLines;
    private Integer filesAnalyzed;
    private Integer criticalIssues;
    private Integer majorIssues;
    private Integer minorIssues;
    private LocalDateTime createdAt;
    private List<FindingDto> findings;
    private List<RecommendationDto> recommendations;

    public HealthReportDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAnalysisRunId() { return analysisRunId; }
    public void setAnalysisRunId(UUID analysisRunId) { this.analysisRunId = analysisRunId; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public Integer getCoverageScore() { return coverageScore; }
    public void setCoverageScore(Integer coverageScore) { this.coverageScore = coverageScore; }

    public Integer getComplexityScore() { return complexityScore; }
    public void setComplexityScore(Integer complexityScore) { this.complexityScore = complexityScore; }

    public Integer getDuplicationScore() { return duplicationScore; }
    public void setDuplicationScore(Integer duplicationScore) { this.duplicationScore = duplicationScore; }

    public Integer getDocumentationScore() { return documentationScore; }
    public void setDocumentationScore(Integer documentationScore) { this.documentationScore = documentationScore; }

    public Integer getSecurityScore() { return securityScore; }
    public void setSecurityScore(Integer securityScore) { this.securityScore = securityScore; }

    public Integer getMaintainabilityScore() { return maintainabilityScore; }
    public void setMaintainabilityScore(Integer maintainabilityScore) { this.maintainabilityScore = maintainabilityScore; }

    public Integer getTotalLines() { return totalLines; }
    public void setTotalLines(Integer totalLines) { this.totalLines = totalLines; }

    public Integer getFilesAnalyzed() { return filesAnalyzed; }
    public void setFilesAnalyzed(Integer filesAnalyzed) { this.filesAnalyzed = filesAnalyzed; }

    public Integer getCriticalIssues() { return criticalIssues; }
    public void setCriticalIssues(Integer criticalIssues) { this.criticalIssues = criticalIssues; }

    public Integer getMajorIssues() { return majorIssues; }
    public void setMajorIssues(Integer majorIssues) { this.majorIssues = majorIssues; }

    public Integer getMinorIssues() { return minorIssues; }
    public void setMinorIssues(Integer minorIssues) { this.minorIssues = minorIssues; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<FindingDto> getFindings() { return findings; }
    public void setFindings(List<FindingDto> findings) { this.findings = findings; }

    public List<RecommendationDto> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationDto> recommendations) { this.recommendations = recommendations; }
}