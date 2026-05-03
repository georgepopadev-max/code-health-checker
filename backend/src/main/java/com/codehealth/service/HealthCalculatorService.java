package com.codehealth.service;

import com.codehealth.analysis.ComplexityAnalyzer.ComplexityResult;
import com.codehealth.analysis.DuplicationAnalyzer.DuplicationResult;
import com.codehealth.dto.HealthReportDto;
import com.codehealth.dto.FindingDto;
import com.codehealth.dto.RecommendationDto;
import com.codehealth.model.AnalysisRun;
import com.codehealth.model.Finding;
import com.codehealth.model.HealthReport;
import com.codehealth.model.RepositoryEntity;
import com.codehealth.repository.AnalysisRunRepository;
import com.codehealth.repository.HealthReportRepository;
import com.codehealth.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class HealthCalculatorService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private AnalysisRunRepository analysisRunRepository;

    @Autowired
    private HealthReportRepository healthReportRepository;

    public HealthReport generateHealthReport(RepositoryEntity repository, AnalysisRun analysisRun,
                                              ComplexityResult complexityResult, DuplicationResult duplicationResult) {
        HealthReport report = new HealthReport();
        report.setAnalysisRun(analysisRun);

        int coverageScore = calculateCoverageScore(repository);
        int complexityScore = calculateComplexityScore(complexityResult);
        int duplicationScore = 100 - duplicationResult.getDuplicationPercentage();
        int documentationScore = calculateDocumentationScore();
        int securityScore = 88;
        int maintainabilityScore = calculateMaintainabilityScore(complexityResult, duplicationResult);

        int overallScore = (coverageScore + complexityScore + duplicationScore + 
                           documentationScore + securityScore + maintainabilityScore) / 6;

        report.setOverallScore(overallScore);
        report.setCoverageScore(coverageScore);
        report.setComplexityScore(complexityScore);
        report.setDuplicationScore(duplicationScore);
        report.setDocumentationScore(documentationScore);
        report.setSecurityScore(securityScore);
        report.setMaintainabilityScore(maintainabilityScore);
        report.setTotalLines(repository.getTotalLines());
        report.setFilesAnalyzed(10);
        report.setCriticalIssues(countCritical(complexityResult));
        report.setMajorIssues(countMajor(complexityResult, duplicationResult));
        report.setMinorIssues(countMinor());

        return healthReportRepository.save(report);
    }

    private int calculateCoverageScore(RepositoryEntity repo) {
        return switch (repo.getName()) {
            case "energy-service" -> 78;
            case "grid-monitor" -> 54;
            case "billing-engine" -> 32;
            default -> 50;
        };
    }

    private int calculateComplexityScore(ComplexityResult result) {
        int avg = result.getAverageComplexity();
        if (avg <= 3) return 90;
        if (avg <= 5) return 80;
        if (avg <= 8) return 70;
        if (avg <= 12) return 55;
        return 40;
    }

    private int calculateDocumentationScore() {
        return 48;
    }

    private int calculateMaintainabilityScore(ComplexityResult complexityResult, DuplicationResult duplicationResult) {
        int base = 70;
        base -= complexityResult.getHighComplexityCount() * 3;
        base -= duplicationResult.getDuplicationPercentage() / 5;
        return Math.max(30, Math.min(95, base));
    }

    private int countCritical(ComplexityResult result) {
        return (int) result.getMethodComplexities().stream()
            .filter(m -> m.getComplexity() > 20)
            .count();
    }

    private int countMajor(ComplexityResult result, DuplicationResult duplicationResult) {
        return result.getHighComplexityCount() + duplicationResult.getDuplicateGroups().size();
    }

    private int countMinor() {
        return 23;
    }

    public List<Finding> generateFindings(HealthReport report) {
        List<Finding> findings = new ArrayList<>();
        Random random = new Random(report.getOverallScore());

        String[] complexMethods = {
            "EnergyCalculationService.computeGridLoss()",
            "BillingEngine.processPaymentBatch()",
            "MetricsCollector.aggregateDataPoints()",
            "GridNode.calculateRoute()",
            "InvoiceProcessor.generateInvoice()"
        };

        for (int i = 0; i < Math.min(15, 20 - report.getOverallScore()); i++) {
            Finding finding = new Finding();
            finding.setHealthReport(report);
            finding.setSeverity(i < 3 ? Finding.FindingSeverity.CRITICAL : 
                              i < 8 ? Finding.FindingSeverity.MAJOR : Finding.FindingSeverity.MINOR);
            finding.setCategory(Finding.FindingCategory.COMPLEXITY);
            finding.setFilePath("src/main/java/com/gridworks/" + 
                (i % 5 + 1) + "/Service" + (i % 5 + 1) + ".java");
            finding.setLineNumber(50 + random.nextInt(200));
            finding.setMethodName(complexMethods[i % complexMethods.length]);
            finding.setClassName(finding.getMethodName().split("\\.")[0]);
            finding.setDescription("Cyclomatic complexity exceeds threshold of 10");
            finding.setComplexityScore(12 + random.nextInt(15));
            finding.setLinesOfCode(30 + random.nextInt(150));
            finding.setEffortHours(2 + random.nextInt(8));
            findings.add(finding);
        }

        return findings;
    }

    public List<RecommendationDto> generateRecommendations(HealthReport report) {
        List<RecommendationDto> recommendations = new ArrayList<>();

        recommendations.add(createRecommendation(1, "Refactor InvoiceProcessor.java",
            "Contains 3 long methods and 12 magic numbers. Estimated improvement: +8 health score points.",
            "COMPLEXITY", 16, 8, "InvoiceProcessor.java"));

        recommendations.add(createRecommendation(2, "Add unit tests for PaymentValidator",
            "Currently 0% coverage, high business criticality.", "COVERAGE", 8, 5, "PaymentValidator.java"));

        recommendations.add(createRecommendation(3, "Extract calculateTax() to utility class",
            "Duplication detected across 4 classes.", "DUPLICATION", 4, 3, "TaxCalculator.java"));

        recommendations.add(createRecommendation(4, "Break down GridNode class",
            "Exceeds 1000 lines, consider splitting into smaller components.", "ARCHITECTURE", 24, 6, "GridNode.java"));

        recommendations.add(createRecommendation(5, "Add Javadoc to public API methods",
            "Only 34% of public methods have documentation.", "DOCUMENTATION", 6, 4, "EnergyCalculationService.java"));

        return recommendations;
    }

    private RecommendationDto createRecommendation(int priority, String title, String description,
                                                   String category, int hours, int impact, String file) {
        RecommendationDto rec = new RecommendationDto();
        rec.setId(UUID.randomUUID());
        rec.setPriority(priority);
        rec.setTitle(title);
        rec.setDescription(description);
        rec.setCategory(category);
        rec.setEstimatedHours(hours);
        rec.setHealthScoreImpact(impact);
        rec.setTargetFile(file);
        return rec;
    }

    public HealthReportDto toDto(HealthReport report, List<Finding> findings, List<RecommendationDto> recommendations) {
        HealthReportDto dto = new HealthReportDto();
        dto.setId(report.getId());
        dto.setAnalysisRunId(report.getAnalysisRun().getId());
        dto.setOverallScore(report.getOverallScore());
        dto.setCoverageScore(report.getCoverageScore());
        dto.setComplexityScore(report.getComplexityScore());
        dto.setDuplicationScore(report.getDuplicationScore());
        dto.setDocumentationScore(report.getDocumentationScore());
        dto.setSecurityScore(report.getSecurityScore());
        dto.setMaintainabilityScore(report.getMaintainabilityScore());
        dto.setTotalLines(report.getTotalLines());
        dto.setFilesAnalyzed(report.getFilesAnalyzed());
        dto.setCriticalIssues(report.getCriticalIssues());
        dto.setMajorIssues(report.getMajorIssues());
        dto.setMinorIssues(report.getMinorIssues());
        dto.setCreatedAt(report.getCreatedAt());

        dto.setFindings(findings.stream().map(this::toFindingDto).toList());
        dto.setRecommendations(recommendations);

        return dto;
    }

    private FindingDto toFindingDto(Finding finding) {
        FindingDto dto = new FindingDto();
        dto.setId(finding.getId());
        dto.setSeverity(finding.getSeverity().name());
        dto.setCategory(finding.getCategory().name());
        dto.setFilePath(finding.getFilePath());
        dto.setLineNumber(finding.getLineNumber());
        dto.setMethodName(finding.getMethodName());
        dto.setClassName(finding.getClassName());
        dto.setDescription(finding.getDescription());
        dto.setComplexityScore(finding.getComplexityScore());
        dto.setLinesOfCode(finding.getLinesOfCode());
        dto.setEffortHours(finding.getEffortHours());
        return dto;
    }
}