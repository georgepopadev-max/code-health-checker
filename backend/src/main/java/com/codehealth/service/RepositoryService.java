package com.codehealth.service;

import com.codehealth.dto.RepositoryDto;
import com.codehealth.github.GitHubClient;
import com.codehealth.model.RepositoryEntity;
import com.codehealth.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RepositoryService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private GitHubClient gitHubClient;

    public List<RepositoryDto> getAllRepositories() {
        List<RepositoryEntity> repos = repositoryRepository.findAll();
        if (repos.isEmpty()) {
            List<RepositoryDto> mockRepos = gitHubClient.getRepositories();
            for (RepositoryDto dto : mockRepos) {
                RepositoryEntity repo = new RepositoryEntity();
                repo.setName(dto.getName());
                repo.setOwner(dto.getOwner());
                repo.setDescription(dto.getDescription());
                repo.setDefaultBranch(dto.getDefaultBranch());
                repo.setHealthScore(dto.getHealthScore());
                repo.setPrimaryLanguage(dto.getPrimaryLanguage());
                repo.setTotalLines(dto.getTotalLines());
                repo.setLastAnalyzedAt(dto.getLastAnalyzedAt());
                repo.setStatus(RepositoryEntity.RepositoryEntityStatus.CONNECTED);
                repositoryRepository.save(repo);
            }
            return mockRepos;
        }
        return repos.stream().map(this::toDto).collect(Collectors.toList());
    }

    public RepositoryDto getRepository(UUID id) {
        RepositoryEntity repo = repositoryRepository.findById(id).orElseThrow();
        return toDto(repo);
    }

    public RepositoryDto getRepositoryByName(String owner, String name) {
        Optional<RepositoryEntity> repoOpt = repositoryRepository.findByOwnerAndName(owner, name);
        if (repoOpt.isPresent()) {
            return toDto(repoOpt.get());
        }
        return gitHubClient.getRepository(owner, name);
    }

    public RepositoryDto connectRepository(String owner, String name, String branch) {
        RepositoryDto remoteRepo = gitHubClient.getRepository(owner, name);
        
        Optional<RepositoryEntity> existingRepo = repositoryRepository.findByOwnerAndName(owner, name);
        RepositoryEntity repo = existingRepo.orElse(new RepositoryEntity());
        
        repo.setName(name);
        repo.setOwner(owner);
        repo.setDescription(remoteRepo.getDescription());
        repo.setDefaultBranch(branch != null ? branch : "main");
        repo.setPrimaryLanguage(remoteRepo.getPrimaryLanguage());
        repo.setTotalLines(remoteRepo.getTotalLines());
        repo.setStatus(RepositoryEntity.RepositoryEntityStatus.CONNECTED);
        
        return toDto(repositoryRepository.save(repo));
    }

    private RepositoryDto toDto(RepositoryEntity repo) {
        RepositoryDto dto = new RepositoryDto();
        dto.setId(repo.getId());
        dto.setName(repo.getName());
        dto.setOwner(repo.getOwner());
        dto.setDescription(repo.getDescription());
        dto.setDefaultBranch(repo.getDefaultBranch());
        dto.setConnectedAt(repo.getConnectedAt());
        dto.setLastAnalyzedAt(repo.getLastAnalyzedAt());
        dto.setHealthScore(repo.getHealthScore());
        dto.setPrimaryLanguage(repo.getPrimaryLanguage());
        dto.setTotalLines(repo.getTotalLines());
        dto.setStatus(repo.getStatus().name());
        return dto;
    }
}