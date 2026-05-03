export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  defaultBranch: string;
  connectedAt: Date;
  lastAnalyzedAt: Date;
  healthScore: number;
  primaryLanguage: string;
  totalLines: number;
  status: string;
}

export interface HealthReport {
  id: string;
  analysisRunId: string;
  overallScore: number;
  coverageScore: number;
  complexityScore: number;
  duplicationScore: number;
  documentationScore: number;
  securityScore: number;
  maintainabilityScore: number;
  totalLines: number;
  filesAnalyzed: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  createdAt: Date;
  findings: Finding[];
  recommendations: Recommendation[];
}

export interface Finding {
  id: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  category: string;
  filePath: string;
  lineNumber: number;
  methodName: string;
  className: string;
  description: string;
  complexityScore: number;
  linesOfCode: number;
  effortHours: number;
}

export interface Recommendation {
  id: string;
  priority: number;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  healthScoreImpact: number;
  targetFile: string;
}

export interface AnalysisRequest {
  owner: string;
  repository: string;
  branch?: string;
}

export interface DashboardStats {
  averageHealthScore: number;
  scoreTrend: number;
  totalLinesAnalyzed: number;
  criticalIssues: number;
  coverageTrend: number;
}