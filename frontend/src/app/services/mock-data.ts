import { Repository, HealthReport, Finding, Recommendation } from '../models';

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: '1',
    name: 'express-rest-api',
    owner: 'acme-corp',
    description: 'High-performance REST API built with Express.js and PostgreSQL',
    defaultBranch: 'main',
    connectedAt: new Date('2024-01-15'),
    lastAnalyzedAt: new Date('2024-03-10'),
    healthScore: 78,
    primaryLanguage: 'TypeScript',
    totalLines: 15420,
    status: 'active'
  },
  {
    id: '2',
    name: 'react-dashboard',
    owner: 'acme-corp',
    description: 'Modern analytics dashboard with React and D3.js visualizations',
    defaultBranch: 'main',
    connectedAt: new Date('2024-02-01'),
    lastAnalyzedAt: new Date('2024-03-08'),
    healthScore: 85,
    primaryLanguage: 'TypeScript',
    totalLines: 8930,
    status: 'active'
  },
  {
    id: '3',
    name: 'ml-pipeline',
    owner: 'data-team',
    description: 'Machine learning data processing pipeline with PyTorch',
    defaultBranch: 'develop',
    connectedAt: new Date('2024-01-20'),
    lastAnalyzedAt: new Date('2024-02-28'),
    healthScore: 62,
    primaryLanguage: 'Python',
    totalLines: 22100,
    status: 'active'
  },
  {
    id: '4',
    name: 'kubernetes-ops',
    owner: 'infra-team',
    description: 'Kubernetes deployment templates and operator patterns',
    defaultBranch: 'main',
    connectedAt: new Date('2023-11-10'),
    lastAnalyzedAt: new Date('2024-03-05'),
    healthScore: 91,
    primaryLanguage: 'Go',
    totalLines: 6780,
    status: 'active'
  },
  {
    id: '5',
    name: 'legacy-monolith',
    owner: 'enterprise',
    description: 'Legacy PHP monolith awaiting gradual modernization',
    defaultBranch: 'master',
    connectedAt: new Date('2023-06-01'),
    lastAnalyzedAt: new Date('2024-01-15'),
    healthScore: 34,
    primaryLanguage: 'PHP',
    totalLines: 89400,
    status: 'needs-attention'
  }
];

export const MOCK_HEALTH_REPORT: HealthReport = {
  id: 'rpt-001',
  analysisRunId: 'run-2024-0310-001',
  overallScore: 72,
  coverageScore: 65,
  complexityScore: 70,
  duplicationScore: 78,
  documentationScore: 68,
  securityScore: 82,
  maintainabilityScore: 71,
  totalLines: 15420,
  filesAnalyzed: 127,
  criticalIssues: 3,
  majorIssues: 18,
  minorIssues: 45,
  createdAt: new Date('2024-03-10'),
  findings: [
    {
      id: 'f-001',
      severity: 'CRITICAL',
      category: 'Security',
      filePath: 'src/auth/middleware.ts',
      lineNumber: 47,
      methodName: 'validateToken',
      className: 'AuthMiddleware',
      description: 'Hardcoded JWT secret found in source code. Move to environment variables.',
      complexityScore: 85,
      linesOfCode: 12,
      effortHours: 2
    },
    {
      id: 'f-002',
      severity: 'CRITICAL',
      category: 'Error Handling',
      filePath: 'src/api/users.controller.ts',
      lineNumber: 112,
      methodName: 'getUserById',
      className: 'UsersController',
      description: 'Uncaught exception thrown without proper error boundary wrapping.',
      complexityScore: 72,
      linesOfCode: 8,
      effortHours: 1
    },
    {
      id: 'f-003',
      severity: 'CRITICAL',
      category: 'Performance',
      filePath: 'src/services/database.service.ts',
      lineNumber: 234,
      methodName: 'query',
      className: 'DatabaseService',
      description: 'N+1 query detected: looped database calls without batching or eager loading.',
      complexityScore: 91,
      linesOfCode: 24,
      effortHours: 4
    },
    {
      id: 'f-004',
      severity: 'MAJOR',
      category: 'Complexity',
      filePath: 'src/utils/helpers.ts',
      lineNumber: 58,
      methodName: 'processData',
      className: 'HelperUtils',
      description: 'Function exceeds 80 lines and has cyclomatic complexity of 15.',
      complexityScore: 78,
      linesOfCode: 94,
      effortHours: 3
    },
    {
      id: 'f-005',
      severity: 'MAJOR',
      category: 'Duplication',
      filePath: 'src/api/orders.controller.ts',
      lineNumber: 89,
      methodName: 'createOrder',
      className: 'OrdersController',
      description: '22 lines duplicated from src/api/base.controller.ts — consider extracting to shared utility.',
      complexityScore: 45,
      linesOfCode: 22,
      effortHours: 1
    }
  ],
  recommendations: [
    {
      id: 'rec-001',
      priority: 1,
      title: 'Extract hardcoded secrets to environment variables',
      description: 'All secrets, API keys, and credentials should be loaded from environment variables at runtime. Use dotenv or a secrets manager.',
      category: 'Security',
      estimatedHours: 2,
      healthScoreImpact: 8,
      targetFile: 'src/auth/middleware.ts'
    },
    {
      id: 'rec-002',
      priority: 2,
      title: 'Implement N+1 query resolution with batching',
      description: 'Use batched database queries or ORM eager loading to eliminate N+1 patterns in data access methods.',
      category: 'Performance',
      estimatedHours: 4,
      healthScoreImpact: 12,
      targetFile: 'src/services/database.service.ts'
    },
    {
      id: 'rec-003',
      priority: 3,
      title: 'Refactor complex helper function',
      description: 'Break down processData into smaller, single-responsibility functions with clear naming.',
      category: 'Maintainability',
      estimatedHours: 3,
      healthScoreImpact: 6,
      targetFile: 'src/utils/helpers.ts'
    },
    {
      id: 'rec-004',
      priority: 4,
      title: 'Introduce transaction error boundaries',
      description: 'Wrap database operations in try-catch with rollback semantics to prevent unhandled exceptions.',
      category: 'Reliability',
      estimatedHours: 2,
      healthScoreImpact: 5,
      targetFile: 'src/api/users.controller.ts'
    },
    {
      id: 'rec-005',
      priority: 5,
      title: 'Increase test coverage to 80%',
      description: 'Current coverage at 65% — prioritize adding unit tests for service layer and API controllers.',
      category: 'Testing',
      estimatedHours: 8,
      healthScoreImpact: 10,
      targetFile: 'src/**/*.spec.ts'
    }
  ]
};
