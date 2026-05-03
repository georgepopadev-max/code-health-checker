package com.codehealth.repository;

import com.codehealth.model.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RepositoryRepository extends JpaRepository<RepositoryEntity, UUID> {
    List<RepositoryEntity> findByOwner(String owner);
    Optional<RepositoryEntity> findByOwnerAndName(String owner, String name);
}