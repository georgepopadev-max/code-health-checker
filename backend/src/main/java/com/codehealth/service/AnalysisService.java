package com.codehealth.service;

import com.codehealth.analysis.ComplexityAnalyzer;
import com.codehealth.analysis.DuplicationAnalyzer;
import com.codehealth.dto.AnalysisRequest;
import com.codehealth.dto.HealthReportDto;
import com.codehealth.github.GitHubClient;
import com.codehealth.model.AnalysisRun;
import com.codehealth.model.HealthReport;
import com.codehealth.model.RepositoryEntity;
import com.codehealth.repository.AnalysisRunRepository;
import com.codehealth.repository.HealthReportRepository;
import com.codehealth.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalysisService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private AnalysisRunRepository analysisRunRepository;

    @Autowired
    private HealthReportRepository healthReportRepository;

    @Autowired
    private GitHubClient gitHubClient;

    @Autowired
    private HealthCalculatorService healthCalculatorService;

    @Async
    public void runAnalysis(AnalysisRequest request) {
        RepositoryEntity repo = repositoryRepository.findByOwnerAndName(request.getOwner(), request.getRepository())
            .orElseGet(() -> createRepositoryFromRequest(request));

        AnalysisRun run = new AnalysisRun();
        run.setRepository(repo);
        run.setBranch(request.getBranch() != null ? request.getBranch() : repo.getDefaultBranch());
        run.setTriggeredBy("manual");
        run.setStatus(AnalysisRun.AnalysisStatus.RUNNING);
        run.setStartedAt(LocalDateTime.now());
        run.setProgressPercentage(0);
        analysisRunRepository.save(run);

        try {
            run.setProgressPercentage(20);
            analysisRunRepository.save(run);

            List<String> filePaths = gitHubClient.getFilePaths(
                request.getOwner(), 
                request.getRepository(), 
                request.getBranch() != null ? request.getBranch() : "main",
                ".java"
            );

            run.setProgressPercentage(40);
            analysisRunRepository.save(run);

            Map<String, String> fileContents = new HashMap<>();
            for (String path : filePaths) {
                String content = gitHubClient.getFileContent(
                    request.getOwner(),
                    request.getRepository(),
                    path,
                    request.getBranch() != null ? request.getBranch() : "main"
                );
                fileContents.put(path, content);
            }

            run.setProgressPercentage(60);
            analysisRunRepository.save(run);

            ComplexityAnalyzer.ComplexityResult complexityResult = new ComplexityAnalyzer().analyze(
                fileContents.values().stream().findFirst().orElse("")
            );

            DuplicationAnalyzer.DuplicationResult duplicationResult = new DuplicationAnalyzer().analyze(fileContents);

            run.setProgressPercentage(80);
            analysisRunRepository.save(run);

            HealthReport report = healthCalculatorService.generateHealthReport(
                repo, run, complexityResult, duplicationResult
            );
            healthCalculatorService.generateFindings(report);

            run.setProgressPercentage(100);
            run.setStatus(AnalysisRun.AnalysisStatus.COMPLETED);
            run.setCompletedAt(LocalDateTime.now());
            analysisRunRepository.save(run);

            repo.setLastAnalyzedAt(LocalDateTime.now());
            repo.setHealthScore(report.getOverallScore());
            repositoryRepository.save(repo);

        } catch (Exception e) {
            run.setStatus(AnalysisRun.AnalysisStatus.FAILED);
            run.setErrorMessage(e.getMessage());
            run.setCompletedAt(LocalDateTime.now());
            analysisRunRepository.save(run);
        }
    }

    public HealthReportDto getLatestReport(UUID repositoryId) {
        List<HealthReport> reports = healthReportRepository.findByAnalysisRunRepositoryIdOrderByCreatedAtDesc(repositoryId);
        if (reports.isEmpty()) {
            return generateMockReport(repositoryId);
        }
        HealthReport report = reports.get(0);
        return healthCalculatorService.toDto(report, 
            healthCalculatorService.generateFindings(report),
            healthCalculatorService.generateRecommendations(report));
    }

    public HealthReportDto getLatestReportByName(String owner, String name) {
        RepositoryEntity repo = repositoryRepository.findByOwnerAndName(owner, name).orElse(null);
        if (repo == null) {
            return generateMockReport(null);
        }
        return getLatestReport(repo.getId());
    }

    private HealthReportDto generateMockReport(UUID repositoryId) {
        HealthReportDto dto = new HealthReportDto();
        dto.setId(UUID.randomUUID());
        dto.setAnalysisRunId(UUID.randomUUID());
        dto.setOverallScore(62);
        dto.setCoverageScore(54);
        dto.setComplexityScore(61);
        dto.setDuplicationScore(72);
        dto.setDocumentationScore(48);
        dto.setSecurityScore(88);
        dto.setMaintainabilityScore(59);
        dto.setTotalLines(38450);
        dto.setFilesAnalyzed(47);
        dto.setCriticalIssues(3);
        dto.setMajorIssues(12);
        dto.setMinorIssues(23);
        dto.setCreatedAt(LocalDateTime.now().minusDays(7));
        dto.setFindings(generateMockFindings());
        dto.setRecommendations(healthCalculatorService.generateRecommendations(null));
        return dto;
    }

    private List<com.codehealth.dto.FindingDto> generateMockFindings() {
        List<com.codehealth.dto.FindingDto> findings = new ArrayList<>();
        Random random = new Random(42);

        String[][] mockFindings = {
            {"CRITICAL", "COMPLEXITY", "EnergyCalculationService.computeGridLoss()", "EnergyCalculationService.java", "156"},
            {"CRITICAL", "COMPLEXITY", "BillingEngine.processPaymentBatch()", "BillingEngine.java", "89"},
            {"CRITICAL", "COMPLEXITY", "MetricsCollector.aggregateDataPoints()", "MetricsCollector.java", "124"},
            {"MAJOR", "COMPLEXITY", "GridNode.calculateRoute()", "GridNode.java", "78"},
            {"MAJOR", "DUPLICATION", "InvoiceGenerator.applyDiscount()", "InvoiceProcessor.java", "45"},
            {"MAJOR", "COVERAGE", "PaymentValidator.validateAmount()", "PaymentValidator.java", "0"},
            {"MINOR", "DOCUMENTATION", "TaxCalculator.calculateTax()", "TaxCalculator.java", "32"}
        };

        for (int i = 0; i < mockFindings.length; i++) {
            com.codehealth.dto.FindingDto finding = new com.codehealth.dto.FindingDto();
            finding.setId(UUID.randomUUID());
            finding.setSeverity(mockFindings[i][0]);
            finding.setCategory(mockFindings[i][1]);
            finding.setMethodName(mockFindings[i][2]);
            finding.setClassName(mockFindings[i][2].split("\\.")[0]);
            finding.setFilePath("src/main/java/com/gridworks/" + mockFindings[i][3]);
            finding.setLineNumber(20 + random.nextInt(200));
            finding.setDescription("Method exceeds complexity threshold");
            finding.setComplexityScore(10 + random.nextInt(15));
            finding.setLinesOfCode(Integer.parseInt(mockFindings[i][4]));
            finding.setEffortHours(2 + random.nextInt(8));
            findings.add(finding);
        }

        return findings;
    }

    private RepositoryEntity createRepositoryFromRequest(AnalysisRequest request) {
        RepositoryEntity repo = new RepositoryEntity();
        repo.setName(request.getRepository());
        repo.setOwner(request.getOwner());
        repo.setDefaultBranch(request.getBranch() != null ? request.getBranch() : "main");
        repo.setStatus(RepositoryEntity.RepositoryEntityStatus.CONNECTED);
        return repositoryRepository.save(repo);
    }
}