package com.codehealth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "repositories")
public class RepositoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String owner;

    private String description;

    @Column(name = "default_branch")
    private String defaultBranch = "main";

    @Column(name = "github_repo_id")
    private Long githubRepoId;

    @Column(name = "connected_at")
    private LocalDateTime connectedAt;

    @Column(name = "last_analyzed_at")
    private LocalDateTime lastAnalyzedAt;

    @Column(name = "health_score")
    private Integer healthScore;

    @Column(name = "primary_language")
    private String primaryLanguage;

    @Column(name = "total_lines")
    private Integer totalLines;

    @Enumerated(EnumType.STRING)
    private RepositoryEntityStatus status = RepositoryEntityStatus.CONNECTED;

    @PrePersist
    protected void onCreate() {
        connectedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDefaultBranch() { return defaultBranch; }
    public void setDefaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; }

    public Long getGithubRepoId() { return githubRepoId; }
    public void setGithubRepoId(Long githubRepoId) { this.githubRepoId = githubRepoId; }

    public LocalDateTime getConnectedAt() { return connectedAt; }
    public void setConnectedAt(LocalDateTime connectedAt) { this.connectedAt = connectedAt; }

    public LocalDateTime getLastAnalyzedAt() { return lastAnalyzedAt; }
    public void setLastAnalyzedAt(LocalDateTime lastAnalyzedAt) { this.lastAnalyzedAt = lastAnalyzedAt; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public String getPrimaryLanguage() { return primaryLanguage; }
    public void setPrimaryLanguage(String primaryLanguage) { this.primaryLanguage = primaryLanguage; }

    public Integer getTotalLines() { return totalLines; }
    public void setTotalLines(Integer totalLines) { this.totalLines = totalLines; }

    public RepositoryEntityStatus getStatus() { return status; }
    public void setStatus(RepositoryEntityStatus status) { this.status = status; }

    public enum RepositoryEntityStatus {
        CONNECTED, ANALYZING, ERROR, DISCONNECTED
    }
}