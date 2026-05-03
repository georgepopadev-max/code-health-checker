package com.codehealth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "health_reports")
public class HealthReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_run_id", nullable = false)
    private AnalysisRun analysisRun;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "coverage_score")
    private Integer coverageScore;

    @Column(name = "complexity_score")
    private Integer complexityScore;

    @Column(name = "duplication_score")
    private Integer duplicationScore;

    @Column(name = "documentation_score")
    private Integer documentationScore;

    @Column(name = "security_score")
    private Integer securityScore;

    @Column(name = "maintainability_score")
    private Integer maintainabilityScore;

    @Column(name = "total_lines")
    private Integer totalLines;

    @Column(name = "files_analyzed")
    private Integer filesAnalyzed;

    @Column(name = "critical_issues")
    private Integer criticalIssues;

    @Column(name = "major_issues")
    private Integer majorIssues;

    @Column(name = "minor_issues")
    private Integer minorIssues;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public AnalysisRun getAnalysisRun() { return analysisRun; }
    public void setAnalysisRun(AnalysisRun analysisRun) { this.analysisRun = analysisRun; }

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
}