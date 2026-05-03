package com.codehealth.repository;

import com.codehealth.model.AnalysisRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalysisRunRepository extends JpaRepository<AnalysisRun, UUID> {
    List<AnalysisRun> findByRepositoryIdOrderByCreatedAtDesc(UUID repositoryId);
}