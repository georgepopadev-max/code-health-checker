package com.codehealth.controller;

import com.codehealth.dto.HealthReportDto;
import com.codehealth.service.AnalysisService;
import com.codehealth.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private ExportService exportService;

    @GetMapping("/{repositoryId}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID repositoryId) {
        HealthReportDto report = analysisService.getLatestReport(repositoryId);
        byte[] pdf = exportService.generatePdfReport(report);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "health-report-" + repositoryId + ".pdf");
        
        return new ResponseEntity<>(pdf, headers, 200);
    }

    @GetMapping("/{repositoryId}/json")
    public ResponseEntity<byte[]> exportJson(@PathVariable UUID repositoryId) {
        HealthReportDto report = analysisService.getLatestReport(repositoryId);
        byte[] json = exportService.generateJsonReport(report);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "health-report-" + repositoryId + ".json");
        
        return new ResponseEntity<>(json, headers, 200);
    }

    @GetMapping("/{owner}/{name}/pdf")
    public ResponseEntity<byte[]> exportPdfByName(
            @PathVariable String owner, @PathVariable String name) {
        HealthReportDto report = analysisService.getLatestReportByName(owner, name);
        byte[] pdf = exportService.generatePdfReport(report);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "health-report-" + owner + "-" + name + ".pdf");
        
        return new ResponseEntity<>(pdf, headers, 200);
    }

    @GetMapping("/{owner}/{name}/json")
    public ResponseEntity<byte[]> exportJsonByName(
            @PathVariable String owner, @PathVariable String name) {
        HealthReportDto report = analysisService.getLatestReportByName(owner, name);
        byte[] json = exportService.generateJsonReport(report);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "health-report-" + owner + "-" + name + ".json");
        
        return new ResponseEntity<>(json, headers, 200);
    }
}