package com.codehealth.github;

import com.codehealth.dto.RepositoryDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "github.mock.enabled", havingValue = "true", matchIfMissing = true)
public class MockGitHubClient implements GitHubClient {

    @Override
    public List<RepositoryDto> getRepositories() {
        return Arrays.asList(
            createRepository("energy-service", "gridworks", "Energy grid optimization service", 87, "Java", 45230, LocalDateTime.now().minusDays(2)),
            createRepository("grid-monitor", "gridworks", "Real-time grid monitoring system", 62, "Java", 38450, LocalDateTime.now().minusDays(7)),
            createRepository("billing-engine", "gridworks", "Billing and invoicing engine", 45, "Java", 43752, LocalDateTime.now().minusDays(30))
        );
    }

    @Override
    public RepositoryDto getRepository(String owner, String repo) {
        return switch (repo.toLowerCase()) {
            case "energy-service" -> createRepository("energy-service", owner, "Energy grid optimization service", 87, "Java", 45230, LocalDateTime.now().minusDays(2));
            case "grid-monitor" -> createRepository("grid-monitor", owner, "Real-time grid monitoring system", 62, "Java", 38450, LocalDateTime.now().minusDays(7));
            case "billing-engine" -> createRepository("billing-engine", owner, "Billing and invoicing engine", 45, "Java", 43752, LocalDateTime.now().minusDays(30));
            default -> createRepository(repo, owner, "Repository", 50, "Java", 10000, LocalDateTime.now());
        };
    }

    @Override
    public String getFileContent(String owner, String repo, String path, String branch) {
        return generateMockJavaCode(path);
    }

    @Override
    public List<String> getFilePaths(String owner, String repo, String branch, String extension) {
        return Arrays.asList(
            "src/main/java/com/gridworks/energy/EnergyCalculationService.java",
            "src/main/java/com/gridworks/energy/GridLossAnalyzer.java",
            "src/main/java/com/gridworks/billing/InvoiceProcessor.java",
            "src/main/java/com/gridworks/monitoring/MetricsCollector.java",
            "src/main/java/com/gridworks/monitoring/AlertManager.java",
            "src/main/java/com/gridworks/billing/PaymentValidator.java",
            "src/main/java/com/gridworks/billing/TaxCalculator.java",
            "src/main/java/com/gridworks/grid/GridNode.java",
            "src/main/java/com/gridworks/grid/GridConnection.java",
            "src/main/java/com/gridworks/config/ConfigurationManager.java"
        );
    }

    private RepositoryDto createRepository(String name, String owner, String description, 
                                           int healthScore, String language, int totalLines, LocalDateTime lastAnalyzed) {
        RepositoryDto dto = new RepositoryDto();
        dto.setId(UUID.randomUUID());
        dto.setName(name);
        dto.setOwner(owner);
        dto.setDescription(description);
        dto.setDefaultBranch("main");
        dto.setHealthScore(healthScore);
        dto.setPrimaryLanguage(language);
        dto.setTotalLines(totalLines);
        dto.setLastAnalyzedAt(lastAnalyzed);
        dto.setStatus("CONNECTED");
        return dto;
    }

    private String generateMockJavaCode(String path) {
        String className = path.contains("/") ? path.substring(path.lastIndexOf('/') + 1).replace(".java", "") : "Sample";
        return """
            package com.gridworks;
            
            public class %s {
                private static final int MAX_CONNECTIONS = 100;
                private static final double DEFAULT_THRESHOLD = 0.75;
                
                private Map<String, Object> cache;
                private List<Connection> activeConnections;
                
                public %s() {
                    this.cache = new HashMap<>();
                    this.activeConnections = new ArrayList<>();
                }
                
                public void processData(Input data) {
                    if (data == null) return;
                    validateInput(data);
                    computeResults(data);
                }
                
                private void validateInput(Input input) {
                    if (input.getValue() == null) {
                        throw new IllegalArgumentException("Invalid input");
                    }
                }
                
                public Result computeResults(Input input) {
                    Result result = new Result();
                    for (Item item : input.getItems()) {
                        result.addValue(processItem(item));
                    }
                    return result;
                }
                
                private double processItem(Item item) {
                    double base = item.getBaseValue();
                    double modifier = calculateModifier(item);
                    return base * modifier;
                }
                
                private double calculateModifier(Item item) {
                    if (item.hasSpecialProperty()) {
                        return 1.5;
                    } else if (item.isExpired()) {
                        return 0.5;
                    }
                    return 1.0;
                }
            }
            """.formatted(className, className);
    }
}