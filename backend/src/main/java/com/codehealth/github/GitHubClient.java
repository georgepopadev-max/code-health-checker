package com.codehealth.github;

import com.codehealth.dto.RepositoryDto;
import java.util.List;

public interface GitHubClient {
    List<RepositoryDto> getRepositories();
    RepositoryDto getRepository(String owner, String repo);
    String getFileContent(String owner, String repo, String path, String branch);
    List<String> getFilePaths(String owner, String repo, String branch, String extension);
}