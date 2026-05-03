package com.codehealth.repository;

import com.codehealth.model.HealthReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthReportRepository extends JpaRepository<HealthReport, UUID> {
    
    @Query("SELECT hr FROM HealthReport hr WHERE hr.analysisRun.repository.id = :repositoryId ORDER BY hr.createdAt DESC")
    List<HealthReport> findByAnalysisRunRepositoryIdOrderByCreatedAtDesc(@Param("repositoryId") UUID repositoryId);
}