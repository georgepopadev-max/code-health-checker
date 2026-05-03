package com.codehealth.controller;

import com.codehealth.dto.AnalysisRequest;
import com.codehealth.dto.HealthReportDto;
import com.codehealth.dto.RepositoryDto;
import com.codehealth.service.AnalysisService;
import com.codehealth.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repositories")
@CrossOrigin(origins = "*")
public class RepositoryController {

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private AnalysisService analysisService;

    @GetMapping
    public ResponseEntity<List<RepositoryDto>> getAllRepositories() {
        return ResponseEntity.ok(repositoryService.getAllRepositories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryDto> getRepository(@PathVariable UUID id) {
        return ResponseEntity.ok(repositoryService.getRepository(id));
    }

    @GetMapping("/{owner}/{name}")
    public ResponseEntity<RepositoryDto> getRepositoryByName(
            @PathVariable String owner, @PathVariable String name) {
        return ResponseEntity.ok(repositoryService.getRepositoryByName(owner, name));
    }

    @PostMapping("/connect")
    public ResponseEntity<RepositoryDto> connectRepository(@RequestBody AnalysisRequest request) {
        return ResponseEntity.ok(repositoryService.connectRepository(
            request.getOwner(), request.getRepository(), request.getBranch()));
    }

    @PostMapping("/{owner}/{name}/analyze")
    public ResponseEntity<Void> triggerAnalysis(
            @PathVariable String owner,
            @PathVariable String name,
            @RequestBody(required = false) AnalysisRequest request) {
        if (request == null) {
            request = new AnalysisRequest();
        }
        request.setOwner(owner);
        request.setRepository(name);
        analysisService.runAnalysis(request);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{owner}/{name}/report")
    public ResponseEntity<HealthReportDto> getLatestReport(
            @PathVariable String owner, @PathVariable String name) {
        return ResponseEntity.ok(analysisService.getLatestReportByName(owner, name));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<HealthReportDto> getReport(@PathVariable UUID id) {
        return ResponseEntity.ok(analysisService.getLatestReport(id));
    }
}