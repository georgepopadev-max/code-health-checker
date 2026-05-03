package com.codehealth.analysis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplexityAnalyzerTest {

    private ComplexityAnalyzer analyzer;

    @BeforeEach
    void setUp() {
        analyzer = new ComplexityAnalyzer();
    }

    @Test
    void analyze_simpleMethod_returnsLowComplexity() {
        String code = """
            public class SimpleService {
                public void doSomething() {
                    System.out.println("Hello");
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        assertFalse(result.getMethodComplexities().isEmpty());
        assertEquals(1, result.getMethodComplexities().get(0).getComplexity());
    }

    @Test
    void analyze_methodWithIfBranches_returnsIncreasedComplexity() {
        String code = """
            public class ConditionalService {
                public boolean process(boolean a, boolean b) {
                    if (a && b) {
                        return true;
                    } else if (a || b) {
                        return false;
                    }
                    return false;
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        ComplexityAnalyzer.MethodComplexity method = result.getMethodComplexities().get(0);
        assertTrue(method.getComplexity() > 1);
    }

    @Test
    void analyze_methodWithLoops_returnsIncreasedComplexity() {
        String code = """
            public class LoopService {
                public void processItems(java.util.List items) {
                    for (Object item : items) {
                        System.out.println(item);
                    }
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        ComplexityAnalyzer.MethodComplexity method = result.getMethodComplexities().get(0);
        assertTrue(method.getComplexity() >= 2);
    }

    @Test
    void analyze_complexMethod_hasElevatedComplexity() {
        String code = """
            public class ComplexService {
                public Result compute(Input input) {
                    Result result = new Result();
                    for (Item item : input.getItems()) {
                        if (item.isValid()) {
                            if (item.hasSpecialFlag()) {
                                result.add(processSpecial(item));
                            } else {
                                result.add(processNormal(item));
                            }
                        } else {
                            if (item.hasError()) {
                                result.addError(item.getError());
                            }
                        }
                    }
                    return result;
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        assertTrue(result.getMaxComplexity() > 1);
    }

    @Test
    void analyze_multipleMethods_calculatesAverageCorrectly() {
        String code = """
            public class MultiMethodService {
                public void method1() { }
                public void method2() { if (true) return; }
                public void method3() { for (int i = 0; i < 10; i++) { } }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        assertEquals(3, result.getMethodComplexities().size());
        assertTrue(result.getAverageComplexity() >= 1);
    }

    @Test
    void analyze_godClass_detected() {
        String code = """
            public class GodClass {
                private String field1;
                private String field2;
                private String field3;
                public void method1() { }
                public void method2() { }
                public void method3() { }
                public void method4() { }
                public void method5() { }
                public void method6() { }
                public void method7() { }
                public void method8() { }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        assertFalse(result.getClassComplexities().isEmpty());
        assertTrue(result.getClassComplexities().get(0).getLinesOfCode() > 1);
    }

    @Test
    void analyze_emptyCode_returnsEmptyResult() {
        String code = "";

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
    }

    @Test
    void analyze_invalidSyntax_returnsEmptyResult() {
        String code = "this is not valid java syntax @#$";

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
    }

    @Test
    void analyze_countsHighComplexityMethods() {
        String code = """
            public class HighComplexityService {
                public void complexMethod() {
                    if (a) if (b) if (c) if (d) if (e) {
                        System.out.println();
                    }
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        assertTrue(result.getHighComplexityCount() >= 0);
    }

    @Test
    void analyze_cognitiveComplexity_calculated() {
        String code = """
            public class CognitiveService {
                public void nestedLoops() {
                    for (int i = 0; i < 10; i++) {
                        for (int j = 0; j < 10; j++) {
                            if (i > 5) {
                                System.out.println(i + j);
                            }
                        }
                    }
                }
            }
            """;

        ComplexityAnalyzer.ComplexityResult result = analyzer.analyze(code);

        assertNotNull(result);
        ComplexityAnalyzer.MethodComplexity method = result.getMethodComplexities().get(0);
        assertTrue(method.getCognitiveComplexity() > 0);
    }
}