package com.codehealth.analysis;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

import java.util.ArrayList;
import java.util.List;

public class ComplexityAnalyzer {

    private static final int COMPLEXITY_THRESHOLD = 10;
    private static final int LONG_METHOD_LINES = 50;
    private static final int GOD_CLASS_LINES = 1000;

    private final JavaParser javaParser;

    public ComplexityAnalyzer() {
        this.javaParser = new JavaParser();
    }

    public ComplexityResult analyze(String sourceCode) {
        ComplexityResult result = new ComplexityResult();
        
        try {
            CompilationUnit cu = javaParser.parse(sourceCode).getResult().orElse(null);
            if (cu == null) return result;

            List<MethodComplexity> methodComplexities = new ArrayList<>();
            List<ClassComplexity> classComplexities = new ArrayList<>();

            cu.accept(new VoidVisitorAdapter<Void>() {
                @Override
                public void visit(ClassOrInterfaceDeclaration cd, Void arg) {
                    int classLines = countClassLines(cd);
                    int classComplexity = calculateClassComplexity(cd);
                    
                    ClassComplexity classResult = new ClassComplexity(
                        cd.getNameAsString(),
                        classLines,
                        classComplexity,
                        classLines > GOD_CLASS_LINES
                    );
                    classComplexities.add(classResult);

                    for (MethodDeclaration md : cd.getMethods()) {
                        int methodLines = countMethodLines(md);
                        int methodComplexity = calculateMethodComplexity(md);
                        
                        MethodComplexity methodResult = new MethodComplexity(
                            md.getNameAsString(),
                            cd.getNameAsString(),
                            methodLines,
                            methodComplexity,
                            calculateCognitiveComplexity(md),
                            methodComplexity > COMPLEXITY_THRESHOLD || methodLines > LONG_METHOD_LINES
                        );
                        methodComplexities.add(methodResult);
                    }
                    super.visit(cd, arg);
                }
            }, null);

            result.setMethodComplexities(methodComplexities);
            result.setClassComplexities(classComplexities);
            result.setAverageComplexity(calculateAverageComplexity(methodComplexities));
            result.setMaxComplexity(findMaxComplexity(methodComplexities));
            result.setHighComplexityCount(countHighComplexity(methodComplexities));

        } catch (Exception e) {
            // Return empty result on parse error
        }
        
        return result;
    }

    private int countMethodLines(MethodDeclaration md) {
        if (md.getRange().isPresent()) {
            return md.getRange().get().getLineCount();
        }
        String[] lines = md.toString().split("\n");
        return lines.length;
    }

    private int countClassLines(ClassOrInterfaceDeclaration cd) {
        if (cd.getRange().isPresent()) {
            return cd.getRange().get().getLineCount();
        }
        String[] lines = cd.toString().split("\n");
        return lines.length;
    }

    private int calculateMethodComplexity(MethodDeclaration md) {
        int complexity = 1;
        String methodBody = md.getBody().map(Object::toString).orElse("");
        
        complexity += countOccurrences(methodBody, "if");
        complexity += countOccurrences(methodBody, "for");
        complexity += countOccurrences(methodBody, "while");
        complexity += countOccurrences(methodBody, "case");
        complexity += countOccurrences(methodBody, "catch");
        complexity += countOccurrences(methodBody, "&&");
        complexity += countOccurrences(methodBody, "||");
        
        long optionalCount = md.getBody().stream()
            .filter(n -> n.toString().contains("Optional"))
            .count();
        complexity += (int) optionalCount;
        
        return complexity;
    }

    private int calculateClassComplexity(ClassOrInterfaceDeclaration cd) {
        int complexity = 1;
        for (MethodDeclaration md : cd.getMethods()) {
            complexity += calculateMethodComplexity(md);
        }
        return complexity;
    }

    private int calculateCognitiveComplexity(MethodDeclaration md) {
        int cognitive = 0;
        String body = md.getBody().map(Object::toString).orElse("");
        
        cognitive += countOccurrences(body, "if") * 1;
        cognitive += countOccurrences(body, "for") * 1;
        cognitive += countOccurrences(body, "while") * 1;
        cognitive += countOccurrences(body, "switch") * 1;
        cognitive += countOccurrences(body, "case") * 1;
        
        cognitive += countOccurrences(body, "&&") * 1;
        cognitive += countOccurrences(body, "||") * 1;
        
        cognitive += countOccurrences(body, "catch") * 2;
        cognitive += countOccurrences(body, "throw") * 1;
        cognitive += countOccurrences(body, "return") * 1;
        
        int nestingLevel = 0;
        for (char c : body.toCharArray()) {
            if (c == '{') nestingLevel++;
            if (c == '}') nestingLevel--;
            if (c == '{' && nestingLevel > 2) {
                cognitive += nestingLevel - 2;
            }
        }
        
        return cognitive;
    }

    private int countOccurrences(String text, String pattern) {
        int count = 0;
        int idx = 0;
        while ((idx = text.indexOf(pattern, idx)) != -1) {
            count++;
            idx += pattern.length();
        }
        return count;
    }

    private int calculateAverageComplexity(List<MethodComplexity> methods) {
        if (methods.isEmpty()) return 0;
        return (int) methods.stream()
            .mapToInt(MethodComplexity::getComplexity)
            .average()
            .orElse(0);
    }

    private int findMaxComplexity(List<MethodComplexity> methods) {
        return methods.stream()
            .mapToInt(MethodComplexity::getComplexity)
            .max()
            .orElse(0);
    }

    private int countHighComplexity(List<MethodComplexity> methods) {
        return (int) methods.stream()
            .filter(m -> m.getComplexity() > COMPLEXITY_THRESHOLD)
            .count();
    }

    public static class ComplexityResult {
        private List<MethodComplexity> methodComplexities = new ArrayList<>();
        private List<ClassComplexity> classComplexities = new ArrayList<>();
        private int averageComplexity;
        private int maxComplexity;
        private int highComplexityCount;

        public List<MethodComplexity> getMethodComplexities() { return methodComplexities; }
        public void setMethodComplexities(List<MethodComplexity> methodComplexities) { this.methodComplexities = methodComplexities; }
        public List<ClassComplexity> getClassComplexities() { return classComplexities; }
        public void setClassComplexities(List<ClassComplexity> classComplexities) { this.classComplexities = classComplexities; }
        public int getAverageComplexity() { return averageComplexity; }
        public void setAverageComplexity(int averageComplexity) { this.averageComplexity = averageComplexity; }
        public int getMaxComplexity() { return maxComplexity; }
        public void setMaxComplexity(int maxComplexity) { this.maxComplexity = maxComplexity; }
        public int getHighComplexityCount() { return highComplexityCount; }
        public void setHighComplexityCount(int highComplexityCount) { this.highComplexityCount = highComplexityCount; }
    }

    public static class MethodComplexity {
        private final String methodName;
        private final String className;
        private final int linesOfCode;
        private final int complexity;
        private final int cognitiveComplexity;
        private final boolean isComplex;

        public MethodComplexity(String methodName, String className, int linesOfCode, 
                               int complexity, int cognitiveComplexity, boolean isComplex) {
            this.methodName = methodName;
            this.className = className;
            this.linesOfCode = linesOfCode;
            this.complexity = complexity;
            this.cognitiveComplexity = cognitiveComplexity;
            this.isComplex = isComplex;
        }

        public String getMethodName() { return methodName; }
        public String getClassName() { return className; }
        public int getLinesOfCode() { return linesOfCode; }
        public int getComplexity() { return complexity; }
        public int getCognitiveComplexity() { return cognitiveComplexity; }
        public boolean isComplex() { return isComplex; }
    }

    public static class ClassComplexity {
        private final String className;
        private final int linesOfCode;
        private final int complexity;
        private final boolean isGodClass;

        public ClassComplexity(String className, int linesOfCode, int complexity, boolean isGodClass) {
            this.className = className;
            this.linesOfCode = linesOfCode;
            this.complexity = complexity;
            this.isGodClass = isGodClass;
        }

        public String getClassName() { return className; }
        public int getLinesOfCode() { return linesOfCode; }
        public int getComplexity() { return complexity; }
        public boolean isGodClass() { return isGodClass; }
    }
}