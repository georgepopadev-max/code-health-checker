package com.codehealth.analysis;

import java.util.*;
import java.util.stream.Collectors;

public class DuplicationAnalyzer {

    private static final int MIN_DUPLICATE_LINES = 5;
    private static final int HASH_WINDOW_SIZE = 5;

    public DuplicationResult analyze(Map<String, String> fileContents) {
        DuplicationResult result = new DuplicationResult();
        Map<String, List<CodeBlock>> hashToBlocks = new HashMap<>();
        Map<String, List<String>> fileLines = new HashMap<>();

        for (Map.Entry<String, String> entry : fileContents.entrySet()) {
            String filePath = entry.getKey();
            String content = entry.getValue();
            List<String> lines = Arrays.asList(content.split("\n"));
            fileLines.put(filePath, lines);

            List<CodeBlock> blocks = extractBlocks(lines);
            for (CodeBlock block : blocks) {
                String hash = calculateHash(block.getLines());
                String key = filePath + ":" + block.getStartLine();
                
                if (!hashToBlocks.containsKey(hash)) {
                    hashToBlocks.put(hash, new ArrayList<>());
                }
                hashToBlocks.get(hash).add(new CodeBlock(filePath, block.getStartLine(), block.getEndLine(), block.getLines()));
            }
        }

        List<DuplicateGroup> duplicateGroups = new ArrayList<>();
        int groupId = 1;

        for (Map.Entry<String, List<CodeBlock>> entry : hashToBlocks.entrySet()) {
            List<CodeBlock> blocks = entry.getValue();
            if (blocks.size() > 1) {
                DuplicateGroup group = new DuplicateGroup();
                group.setGroupId(groupId++);
                group.setLinesOfCode(blocks.get(0).getLines().size());
                group.setOccurrences(blocks.size());
                
                Set<String> files = blocks.stream()
                    .map(CodeBlock::getFilePath)
                    .collect(Collectors.toSet());
                group.setAffectedFiles(new ArrayList<>(files));
                group.setTotalDuplicatedLines(blocks.size() * blocks.get(0).getLines().size());

                duplicateGroups.add(group);
            }
        }

        duplicateGroups.sort((a, b) -> Integer.compare(b.getTotalDuplicatedLines(), a.getTotalDuplicatedLines()));
        result.setDuplicateGroups(duplicateGroups);
        result.setTotalDuplicatedLines(duplicateGroups.stream().mapToInt(DuplicateGroup::getTotalDuplicatedLines).sum());
        result.setDuplicationPercentage(calculateDuplicationPercentage(fileLines, result.getTotalDuplicatedLines()));

        return result;
    }

    private List<CodeBlock> extractBlocks(List<String> lines) {
        List<CodeBlock> blocks = new ArrayList<>();
        
        for (int i = 0; i <= lines.size() - MIN_DUPLICATE_LINES; i++) {
            List<String> window = lines.subList(i, Math.min(i + MIN_DUPLICATE_LINES, lines.size()));
            if (isCodeLine(window)) {
                blocks.add(new CodeBlock("file", i, i + window.size() - 1, window));
            }
        }
        
        return blocks;
    }

    private boolean isCodeLine(List<String> lines) {
        long codeLines = lines.stream()
            .filter(l -> !l.trim().isEmpty() && !l.trim().startsWith("//") && !l.trim().startsWith("/*"))
            .count();
        return codeLines >= MIN_DUPLICATE_LINES;
    }

    private String calculateHash(List<String> lines) {
        String normalized = lines.stream()
            .map(String::trim)
            .filter(l -> !l.isEmpty())
            .collect(Collectors.joining("\n"));
        return Integer.toHexString(normalized.hashCode());
    }

    private int calculateDuplicationPercentage(Map<String, List<String>> fileLines, int duplicatedLines) {
        int totalLines = fileLines.values().stream()
            .mapToInt(List::size)
            .sum();
        if (totalLines == 0) return 0;
        return (int) ((duplicatedLines * 100.0) / totalLines);
    }

    public static class DuplicationResult {
        private List<DuplicateGroup> duplicateGroups = new ArrayList<>();
        private int totalDuplicatedLines;
        private int duplicationPercentage;

        public List<DuplicateGroup> getDuplicateGroups() { return duplicateGroups; }
        public void setDuplicateGroups(List<DuplicateGroup> duplicateGroups) { this.duplicateGroups = duplicateGroups; }
        public int getTotalDuplicatedLines() { return totalDuplicatedLines; }
        public void setTotalDuplicatedLines(int totalDuplicatedLines) { this.totalDuplicatedLines = totalDuplicatedLines; }
        public int getDuplicationPercentage() { return duplicationPercentage; }
        public void setDuplicationPercentage(int duplicationPercentage) { this.duplicationPercentage = duplicationPercentage; }
    }

    public static class DuplicateGroup {
        private int groupId;
        private int linesOfCode;
        private int occurrences;
        private List<String> affectedFiles;
        private int totalDuplicatedLines;

        public int getGroupId() { return groupId; }
        public void setGroupId(int groupId) { this.groupId = groupId; }
        public int getLinesOfCode() { return linesOfCode; }
        public void setLinesOfCode(int linesOfCode) { this.linesOfCode = linesOfCode; }
        public int getOccurrences() { return occurrences; }
        public void setOccurrences(int occurrences) { this.occurrences = occurrences; }
        public List<String> getAffectedFiles() { return affectedFiles; }
        public void setAffectedFiles(List<String> affectedFiles) { this.affectedFiles = affectedFiles; }
        public int getTotalDuplicatedLines() { return totalDuplicatedLines; }
        public void setTotalDuplicatedLines(int totalDuplicatedLines) { this.totalDuplicatedLines = totalDuplicatedLines; }
    }

    private static class CodeBlock {
        private final String filePath;
        private final int startLine;
        private final int endLine;
        private final List<String> lines;

        public CodeBlock(String filePath, int startLine, int endLine, List<String> lines) {
            this.filePath = filePath;
            this.startLine = startLine;
            this.endLine = endLine;
            this.lines = lines;
        }

        public String getFilePath() { return filePath; }
        public int getStartLine() { return startLine; }
        public int getEndLine() { return endLine; }
        public List<String> getLines() { return lines; }
    }
}