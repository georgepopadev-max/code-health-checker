# Code Health Checker — Project Specification

## 1. Project Overview

**Project Name:** Code Health Checker  
**Type:** Software quality analysis and reporting platform  
**Core Functionality:** Analyzes GitHub repositories to generate comprehensive code quality reports covering test coverage, cyclomatic complexity, code duplication, tech debt indicators, and maintainability scores. Provides actionable insights for engineering teams and technical leadership.  
**Target Users:** Engineering managers, tech leads, QA engineers, and developers seeking to improve codebase quality.

---

## 2. Description

Code Health Checker is a comprehensive static analysis platform that connects to GitHub repositories and produces detailed quality reports across multiple dimensions: test coverage, code complexity, duplication hotspots, dependency health, and architectural patterns. The system integrates with GitHub's API to fetch repository data, then runs a battery of analysis tools including JaCoCo for coverage, SonarQube-style complexity analysis, and custom detectors for tech debt patterns.

The Angular dashboard presents reports through intuitive visualizations — radar charts for quality dimensions, trend graphs for historical metrics, and treemaps for code structure. Reports can be generated on-demand or scheduled (weekly/monthly) with automatic diff alerts when metrics degrade.

The Spring Boot backend handles GitHub OAuth authentication, repository scanning orchestration, and report generation. Analysis runs in background jobs with progress tracking. Results are cached in PostgreSQL with version history for trend analysis.

---

## 3. Technology Stack

### Frontend
- **Framework:** Angular 17 (standalone components)
- **Charts:** Chart.js for radar charts, line trends, bar charts; D3.js for treemaps
- **UI Library:** Angular Material with reporting/dashboard theme
- **GitHub Integration:** OAuth via GitHub Apps, REST API consumption
- **State Management:** NgRx with entity adapter for repositories
- **Build Tool:** Angular CLI

### Backend
- **Framework:** Spring Boot 3.2 (Java 17+)
- **GitHub API:** REST client with fine-grained token management
- **Analysis Engine:** Custom analyzers + integration with external tools (JaCoCo, PMD)
- **Code Processing:** JavaParser for AST analysis (complexity metrics, duplication detection)
- **Report Generation:** Custom PDF generation using iText, CSV export via Apache Commons
- **Database:** PostgreSQL 15 for reports, repositories, user data
- **Authentication:** GitHub OAuth 2.0 + JWT for session management
- **Background Jobs:** Spring @Scheduled + @Async for analysis tasks

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **External Tools:** JaCoCo agent, PMD static analyzer (bundled in container)

---

## 4. Feature List

### Core Features
1. **GitHub Repository Connection** — OAuth-based authentication, repository browsing, branch selection
2. **Multi-Dimensional Analysis** — Coverage, complexity, duplication, dependency analysis
3. **Quality Radar Chart** — Visual summary across 6 dimensions: Coverage, Complexity, Duplication, Documentation, Security, Maintainability
4. **Coverage Analysis** — Line coverage, branch coverage, untested file identification
5. **Complexity Metrics** — Cyclomatic complexity per method/class, cognitive complexity scores
6. **Duplication Detection** — Exact and near-match duplicate code blocks
7. **Tech Debt Tracking** — Detection of long methods, god classes, circular dependencies, magic numbers
8. **Dependency Analysis** — Outdated dependencies, security vulnerabilities, license issues
9. **Trend Reports** — Historical metric tracking across analysis runs
10. **Actionable Recommendations** — Prioritized list of improvement suggestions with effort estimates

### Report Features
- **Executive Summary** — High-level health score and key findings for non-technical stakeholders
- **Detailed Technical Report** — Full breakdown with code snippets and line references
- **Comparison Mode** — Side-by-side comparison of two branches or time points
- **Export Formats** — PDF report, CSV data export, JSON for CI/CD integration
- **Scheduled Analysis** — Configure automatic analysis on schedule (cron expression)

### Collaboration Features
- Team workspaces with shared repository lists
- Report sharing with expiration links
- Comment threads on specific findings
- Integration with Jira/Linear for issue creation

---

## 5. Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Angular Frontend                             │
│   Dashboard │ Repository List │ Report Viewer │ Settings │ Export  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API
┌──────────────────────────────▼──────────────────────────────────────┐
│                       Spring Boot API                                │
│   Repository Service │ Analysis Orchestrator │ Report Generator      │
└────────┬─────────────────────┬──────────────────────┬────────────────┘
         │                     │                      │
  ┌──────▼──────┐  ┌───────────▼───────────┐  ┌──────▼──────┐
  │ GitHub API  │  │ Analysis Engine        │  │ PostgreSQL  │
  │ Client      │  │ (JaCoCo, PMD, Custom)  │  │ (Reports,   │
  └─────────────┘  └────────────────────────┘  │  History)   │
                                              └─────────────┘
         │
  ┌──────▼──────────────┐
  │ Background Job      │
  │ Executor (Async)    │
  └─────────────────────┘
```

### Frontend Modules

**`app/features/dashboard/`** — Main dashboard with health score cards and recent activity  
**`app/features/repositories/`** — Repository list with connection status, last analysis date  
**`app/features/analysis/`** — Analysis configuration, progress tracking, results visualization  
**`app/features/reports/`** — Report viewer with tabs for each quality dimension  
**`app/features/settings/`** — GitHub connection management, notification preferences  
**`app/shared/components/`** — Radar chart, complexity heatmap, treemap, diff viewer

### Backend Modules

**`github/`** — GitHub OAuth flow, API client with rate limit handling, webhook receiver  
**`analysis/`** — Orchestrates analysis pipeline: clone → analyze → interpret results  
**`metrics/`** — Calculates derived metrics (health score, trends, comparisons)  
**`reporting/`** — PDF generation, CSV export, report templating  
**`scheduler/`** — Cron-based analysis triggers, notification dispatch  
**`scm/`** — Git operations via JGit for commit-level analysis

### Data Model

**Repository**
- id (UUID), name, owner, defaultBranch, githubRepoId, connectedAt, lastAnalyzedAt

**AnalysisRun**
- id (UUID), repositoryId (FK), branch, triggeredBy, status, startedAt, completedAt

**CoverageMetrics**
- lineCoverage, branchCoverage, uncoveredLines (text), coveredLines (text)

**ComplexityMetrics**
- averageComplexity, maxComplexity, methodsExceedingThreshold, cognitiveComplexityAvg

**DuplicateBlock**
- filePath, startLine, endLine, hash, occurrences (count), linesOfCode

**HealthReport**
- id (UUID), analysisRunId (FK), overallScore, coverageScore, complexityScore, duplicationScore, documentationScore, securityScore, maintainabilityScore, pdfPath, createdAt

---

## 6. Deliverables

1. **Source Code** — Complete Angular frontend and Spring Boot backend
2. **Docker Compose** — Full environment with PostgreSQL, bundled analysis tools
3. **GitHub Integration** — OAuth app setup guide, webhook configuration documentation
4. **Analysis Tools** — JaCoCo integration, PMD rule sets, custom complexity detectors
5. **API Documentation** — OpenAPI spec for REST endpoints
6. **Test Suite** — Unit tests for metric calculations, integration tests for GitHub API
7. **Sample Reports** — Pre-generated reports for demo repository
8. **README** — Setup, GitHub App creation, first analysis walkthrough

---

## 7. Demo Description

The demo launches with a dashboard showing the Code Health Checker interface.

**Repository Dashboard:** The main view shows 3 connected repositories:
- "energy-service" (last analyzed 2 days ago, health score 87/100, green indicator)
- "grid-monitor" (last analyzed 1 week ago, health score 62/100, yellow indicator)
- "billing-engine" (last analyzed 1 month ago, health score 45/100, red indicator)

**Health Overview Cards:** Row of 4 cards showing:
- "Average Health Score: 64/100" with trend arrow showing +3 from last month
- "Total Lines Analyzed: 127,432"
- "Critical Issues: 3" (clickable, opens issue list)
- "Coverage Trend: +12% since Q1"

**Radar Chart View:** Clicking "View Details" on "grid-monitor" opens a full report. The first tab shows a radar chart with 6 axes:
- Coverage: 54%
- Complexity: 61%
- Duplication: 72%
- Documentation: 48%
- Security: 88%
- Maintainability: 59%

**Coverage Breakdown:** Second tab shows a treemap where each rectangle represents a Java file, sized by line count, colored by coverage (green=high, yellow=medium, red=low). Clicking a low-coverage rectangle shows file details with highlighted uncovered lines.

**Complexity Findings:** Third tab lists 15 methods exceeding complexity threshold of 10, sorted by severity:
1. `EnergyCalculationService.computeGridLoss()` — Complexity: 24, Cognitive: 19, Lines: 156
2. `BillingEngine.processPaymentBatch()` — Complexity: 18, Cognitive: 15, Lines: 89

Each finding has "View Code" button that shows the method with color-highlighted complexity hotspots.

**Tech Debt Summary:** Fourth tab shows a categorized list:
- **Long Methods (>50 lines):** 8 found, estimated 16 hours to refactor
- **God Classes (>1000 lines):** 3 found, estimated 3 days to refactor
- **Circular Dependencies:** 2 packages affected
- **Magic Numbers:** 47 occurrences across 23 files

**Recommendations Panel:** Bottom section shows AI-generated suggestions:
1. "Prioritize refactoring `InvoiceProcessor.java` — contains 3 long methods and 12 magic numbers. Estimated improvement: +8 health score points."
2. "Add unit tests for `PaymentValidator` — currently 0% coverage, high business criticality."
3. "Consider extracting `calculateTax()` into utility class to reduce duplication across 4 classes."

**Export Options:** Top-right toolbar with buttons: "Download PDF Report," "Export CSV," "Share Link," "Schedule Analysis."

**Trend Comparison:** A dropdown allows selecting a previous analysis date to overlay. The radar chart then shows two overlapping polygons (current in blue, previous in gray dashed) making it easy to see which dimensions improved or degraded.