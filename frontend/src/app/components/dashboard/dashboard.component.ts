import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Repository, HealthReport, DashboardStats } from '../../models';
import { RadarChartComponent } from '../radar-chart/radar-chart.component';
import { MetricsCardComponent } from '../metrics-card/metrics-card.component';
import { FindingsListComponent } from '../findings-list/findings-list.component';
import { RecommendationsComponent } from '../recommendations/recommendations.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RadarChartComponent, MetricsCardComponent, FindingsListComponent, RecommendationsComponent, DecimalPipe],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Code Health Dashboard</h1>
        <div class="header-actions">
          <button class="btn-primary" (click)="refreshData()">Refresh</button>
        </div>
      </header>

      <section class="stats-row">
        <app-metrics-card 
          title="Average Health Score" 
          [value]="stats.averageHealthScore" 
          suffix="/100"
          [trend]="stats.scoreTrend"
          trendLabel="from last month">
        </app-metrics-card>
        <app-metrics-card 
          title="Total Lines Analyzed" 
          [value]="stats.totalLinesAnalyzed">
        </app-metrics-card>
        <app-metrics-card 
          title="Critical Issues" 
          [value]="stats.criticalIssues"
          [highlight]="stats.criticalIssues > 0">
        </app-metrics-card>
        <app-metrics-card 
          title="Coverage Trend" 
          [value]="stats.coverageTrend"
          suffix="%"
          [trend]="stats.coverageTrend"
          trendLabel="since Q1">
        </app-metrics-card>
      </section>

      <section class="main-content">
        <div class="repositories-panel">
          <h2>Repositories</h2>
          <div class="repo-list">
            <div 
              *ngFor="let repo of repositories" 
              class="repo-card"
              [class.selected]="selectedRepo?.id === repo.id"
              [class.healthy]="repo.healthScore >= 75"
              [class.warning]="repo.healthScore >= 50 && repo.healthScore < 75"
              [class.critical]="repo.healthScore < 50"
              (click)="selectRepository(repo)">
              <div class="repo-header">
                <span class="repo-name">{{ repo.name }}</span>
                <span class="health-badge" [class]="getHealthClass(repo.healthScore)">
                  {{ repo.healthScore }}/100
                </span>
              </div>
              <div class="repo-owner">{{ repo.owner }}</div>
              <div class="repo-meta">
                <span>{{ repo.primaryLanguage }}</span>
                <span>{{ repo.totalLines | number }} lines</span>
                <span *ngIf="repo.lastAnalyzedAt">Analyzed {{ formatDate(repo.lastAnalyzedAt) }}</span>
              </div>
              <button class="btn-analysis" (click)="runAnalysis(repo, $event)">
                Run Analysis
              </button>
            </div>
          </div>
        </div>

        <div class="report-panel" *ngIf="selectedRepo">
          <div class="report-header">
            <h2>{{ selectedRepo.name }} Report</h2>
            <div class="export-actions">
              <button class="btn-export" (click)="downloadPdf()">Download PDF</button>
              <button class="btn-export" (click)="downloadJson()">Export JSON</button>
            </div>
          </div>

          <div class="report-content">
            <div class="radar-section">
              <h3>Health Radar</h3>
              <app-radar-chart 
                *ngIf="currentReport"
                [data]="currentReport"
                [previousData]="previousReport">
              </app-radar-chart>
            </div>

            <div class="tabs">
              <button 
                *ngFor="let tab of tabs; let i = index"
                class="tab"
                [class.active]="activeTab === i"
                (click)="activeTab = i">
                {{ tab }}
              </button>
            </div>

            <div class="tab-content">
              <app-findings-list 
                *ngIf="activeTab === 0 && currentReport"
                [findings]="currentReport.findings"
                (sort)="sortFindings($event)">
              </app-findings-list>

              <div *ngIf="activeTab === 1 && currentReport" class="tech-debt">
                <h4>Tech Debt Summary</h4>
                <div class="debt-item">
                  <span class="debt-label">Long Methods (>50 lines):</span>
                  <span class="debt-value">8 found, estimated 16 hours to refactor</span>
                </div>
                <div class="debt-item">
                  <span class="debt-label">God Classes (>1000 lines):</span>
                  <span class="debt-value">3 found, estimated 3 days to refactor</span>
                </div>
                <div class="debt-item">
                  <span class="debt-label">Circular Dependencies:</span>
                  <span class="debt-value">2 packages affected</span>
                </div>
                <div class="debt-item">
                  <span class="debt-label">Magic Numbers:</span>
                  <span class="debt-value">47 occurrences across 23 files</span>
                </div>
              </div>

              <app-recommendations 
                *ngIf="activeTab === 2 && currentReport"
                [recommendations]="currentReport.recommendations">
              </app-recommendations>
            </div>
          </div>
        </div>

        <div class="no-selection" *ngIf="!selectedRepo">
          <p>Select a repository to view its health report</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      min-height: 100vh;
      background: #f5f7fa;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .dashboard-header h1 {
      font-size: 28px;
      color: #1a1a2e;
      margin: 0;
    }
    .btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-primary:hover { background: #4338ca; }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .main-content {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
    }
    .repositories-panel {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .repositories-panel h2 {
      font-size: 18px;
      color: #1a1a2e;
      margin: 0 0 16px 0;
    }
    .repo-list { display: flex; flex-direction: column; gap: 12px; }
    .repo-card {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .repo-card:hover { border-color: #4f46e5; }
    .repo-card.selected { border-color: #4f46e5; background: #f0f0ff; }
    .repo-card.healthy { border-left: 4px solid #22c55e; }
    .repo-card.warning { border-left: 4px solid #eab308; }
    .repo-card.critical { border-left: 4px solid #ef4444; }
    .repo-header { display: flex; justify-content: space-between; align-items: center; }
    .repo-name { font-weight: 600; color: #1a1a2e; }
    .health-badge {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }
    .health-badge.green { background: #dcfce7; color: #166534; }
    .health-badge.yellow { background: #fef9c3; color: #854d0e; }
    .health-badge.red { background: #fee2e2; color: #991b1b; }
    .repo-owner { color: #6b7280; font-size: 13px; margin: 4px 0; }
    .repo-meta { display: flex; gap: 12px; font-size: 12px; color: #9ca3af; margin: 8px 0; }
    .btn-analysis {
      width: 100%;
      margin-top: 8px;
      padding: 8px;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .btn-analysis:hover { background: #e5e7eb; }
    .report-panel {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .report-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .report-header h2 { margin: 0; font-size: 22px; color: #1a1a2e; }
    .export-actions { display: flex; gap: 8px; }
    .btn-export {
      padding: 8px 16px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .btn-export:hover { background: #f9fafb; }
    .radar-section { text-align: center; margin: 24px 0; }
    .radar-section h3 { color: #4b5563; font-size: 16px; margin-bottom: 16px; }
    .tabs { display: flex; gap: 4px; border-bottom: 1px solid #e5e7eb; margin: 20px 0; }
    .tab {
      padding: 12px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #6b7280;
      border-bottom: 2px solid transparent;
    }
    .tab.active { color: #4f46e5; border-bottom-color: #4f46e5; }
    .tech-debt { padding: 16px 0; }
    .tech-debt h4 { color: #374151; margin-bottom: 16px; }
    .debt-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .debt-label { font-weight: 500; color: #374151; }
    .debt-value { color: #6b7280; }
    .no-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 12px;
      color: #9ca3af;
    }
  `]
})
export class DashboardComponent implements OnInit {
  repositories: Repository[] = [];
  selectedRepo: Repository | null = null;
  currentReport: HealthReport | null = null;
  previousReport: HealthReport | null = null;
  stats: DashboardStats = {
    averageHealthScore: 64,
    scoreTrend: 3,
    totalLinesAnalyzed: 127432,
    criticalIssues: 3,
    coverageTrend: 12
  };
  tabs = ['Findings', 'Tech Debt', 'Recommendations'];
  activeTab = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRepositories();
  }

  loadRepositories() {
    this.apiService.getRepositories().subscribe({
      next: (repos) => {
        this.repositories = repos;
        if (repos.length > 0 && !this.selectedRepo) {
          this.selectRepository(repos[1]);
        }
      },
      error: () => {
        this.repositories = this.getMockRepositories();
        if (this.repositories.length > 1) {
          this.selectRepository(this.repositories[1]);
        }
      }
    });
  }

  selectRepository(repo: Repository) {
    this.selectedRepo = repo;
    this.loadReport(repo);
  }

  loadReport(repo: Repository) {
    this.apiService.getLatestReport(repo.owner, repo.name).subscribe({
      next: (report) => this.currentReport = report,
      error: () => this.currentReport = this.getMockReport()
    });
  }

  runAnalysis(repo: Repository, event: Event) {
    event.stopPropagation();
    this.apiService.triggerAnalysis(repo.owner, repo.name).subscribe();
  }

  refreshData() {
    this.loadRepositories();
  }

  downloadPdf() {
    if (!this.selectedRepo) return;
    this.apiService.exportPdf(this.selectedRepo.owner, this.selectedRepo.name).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${this.selectedRepo?.name}.pdf`;
      a.click();
    });
  }

  downloadJson() {
    if (!this.selectedRepo) return;
    this.apiService.exportJson(this.selectedRepo.owner, this.selectedRepo.name).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${this.selectedRepo?.name}.json`;
      a.click();
    });
  }

  sortFindings(criteria: string) {
    if (!this.currentReport) return;
    this.currentReport.findings.sort((a, b) => {
      if (criteria === 'severity') {
        const order = { CRITICAL: 0, MAJOR: 1, MINOR: 2, INFO: 3 };
        return order[a.severity] - order[b.severity];
      }
      return b.complexityScore - a.complexityScore;
    });
  }

  getHealthClass(score: number): string {
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  }

  getMockRepositories(): Repository[] {
    return [
      {
        id: '1',
        name: 'energy-service',
        owner: 'gridworks',
        description: 'Energy grid optimization service',
        defaultBranch: 'main',
        connectedAt: new Date(),
        lastAnalyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        healthScore: 87,
        primaryLanguage: 'Java',
        totalLines: 45230,
        status: 'CONNECTED'
      },
      {
        id: '2',
        name: 'grid-monitor',
        owner: 'gridworks',
        description: 'Real-time grid monitoring system',
        defaultBranch: 'main',
        connectedAt: new Date(),
        lastAnalyzedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        healthScore: 62,
        primaryLanguage: 'Java',
        totalLines: 38450,
        status: 'CONNECTED'
      },
      {
        id: '3',
        name: 'billing-engine',
        owner: 'gridworks',
        description: 'Billing and invoicing engine',
        defaultBranch: 'main',
        connectedAt: new Date(),
        lastAnalyzedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        healthScore: 45,
        primaryLanguage: 'Java',
        totalLines: 43752,
        status: 'CONNECTED'
      }
    ];
  }

  getMockReport(): HealthReport {
    return {
      id: 'r1',
      analysisRunId: 'a1',
      overallScore: 62,
      coverageScore: 54,
      complexityScore: 61,
      duplicationScore: 72,
      documentationScore: 48,
      securityScore: 88,
      maintainabilityScore: 59,
      totalLines: 38450,
      filesAnalyzed: 47,
      criticalIssues: 3,
      majorIssues: 12,
      minorIssues: 23,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      findings: [
        { id: 'f1', severity: 'CRITICAL', category: 'COMPLEXITY', filePath: 'src/main/java/com/gridworks/energy/EnergyCalculationService.java', lineNumber: 156, methodName: 'computeGridLoss()', className: 'EnergyCalculationService', description: 'Cyclomatic complexity exceeds threshold of 10', complexityScore: 24, linesOfCode: 156, effortHours: 8 },
        { id: 'f2', severity: 'CRITICAL', category: 'COMPLEXITY', filePath: 'src/main/java/com/gridworks/billing/BillingEngine.java', lineNumber: 89, methodName: 'processPaymentBatch()', className: 'BillingEngine', description: 'Cyclomatic complexity exceeds threshold of 10', complexityScore: 18, linesOfCode: 89, effortHours: 6 },
        { id: 'f3', severity: 'CRITICAL', category: 'COMPLEXITY', filePath: 'src/main/java/com/gridworks/monitoring/MetricsCollector.java', lineNumber: 124, methodName: 'aggregateDataPoints()', className: 'MetricsCollector', description: 'Cyclomatic complexity exceeds threshold of 10', complexityScore: 16, linesOfCode: 124, effortHours: 5 },
        { id: 'f4', severity: 'MAJOR', category: 'COMPLEXITY', filePath: 'src/main/java/com/gridworks/grid/GridNode.java', lineNumber: 78, methodName: 'calculateRoute()', className: 'GridNode', description: 'Method complexity above threshold', complexityScore: 14, linesOfCode: 78, effortHours: 4 },
        { id: 'f5', severity: 'MAJOR', category: 'DUPLICATION', filePath: 'src/main/java/com/gridworks/billing/InvoiceProcessor.java', lineNumber: 45, methodName: 'applyDiscount()', className: 'InvoiceProcessor', description: 'Duplicate code detected across 4 files', complexityScore: 8, linesOfCode: 45, effortHours: 3 }
      ],
      recommendations: [
        { id: 'rc1', priority: 1, title: 'Refactor InvoiceProcessor.java', description: 'Contains 3 long methods and 12 magic numbers. Estimated improvement: +8 health score points.', category: 'COMPLEXITY', estimatedHours: 16, healthScoreImpact: 8, targetFile: 'InvoiceProcessor.java' },
        { id: 'rc2', priority: 2, title: 'Add unit tests for PaymentValidator', description: 'Currently 0% coverage, high business criticality.', category: 'COVERAGE', estimatedHours: 8, healthScoreImpact: 5, targetFile: 'PaymentValidator.java' },
        { id: 'rc3', priority: 3, title: 'Extract calculateTax() to utility class', description: 'Duplication detected across 4 classes.', category: 'DUPLICATION', estimatedHours: 4, healthScoreImpact: 3, targetFile: 'TaxCalculator.java' }
      ]
    };
  }
}