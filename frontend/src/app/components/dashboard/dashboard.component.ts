import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Repository, HealthReport, DashboardStats } from '../../models';
import { USE_MOCK_DATA } from '../../constants';
import { RadarChartComponent } from '../radar-chart/radar-chart.component';
import { MetricsCardComponent } from '../metrics-card/metrics-card.component';
import { FindingsListComponent } from '../findings-list/findings-list.component';
import { RecommendationsComponent } from '../recommendations/recommendations.component';
import { SkeletonComponent, SkeletonCardComponent, SkeletonMetricsComponent, BadgeComponent, ButtonComponent } from '../ui';
import { UseRepositoriesHook } from '../../hooks/use-repositories.hook';
import { UseHealthReportHook } from '../../hooks/use-health-report.hook';
import { UseAnalysisHook } from '../../hooks/use-analysis.hook';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RadarChartComponent,
    MetricsCardComponent,
    FindingsListComponent,
    RecommendationsComponent,
    DecimalPipe,
    SkeletonComponent,
    SkeletonCardComponent,
    SkeletonMetricsComponent,
    BadgeComponent,
    ButtonComponent
  ],
  template: `
    <div class="dashboard">
      <!-- Mock Mode Banner -->
      <div *ngIf="USE_MOCK_DATA" class="mock-banner">
        <span class="mock-banner__icon">⚠️</span>
        <span class="mock-banner__text">Mock Mode Active - Using sample data</span>
        <button class="mock-banner__toggle" (click)="toggleMockMode()">
          {{ USE_MOCK_DATA ? 'Disable' : 'Enable' }} Mock
        </button>
      </div>

      <header class="dashboard-header">
        <div class="header-content">
          <h1>Code Health Dashboard</h1>
          <p class="header-subtitle">Monitor and analyze your repository health metrics</p>
        </div>
        <div class="header-actions">
          <app-button variant="primary" (clicked)="refreshData()">
            Refresh
          </app-button>
        </div>
      </header>

      <!-- Loading State -->
      <section *ngIf="isLoading()" class="stats-row">
        <app-skeleton-metrics></app-skeleton-metrics>
      </section>

      <!-- Stats Row -->
      <section *ngIf="!isLoading()" class="stats-row">
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
        <!-- Repositories Panel -->
        <div class="repositories-panel">
          <div class="panel-header">
            <h2>Repositories</h2>
            <app-badge *ngIf="repositories().length > 0" variant="info">
              {{ repositories().length }}
            </app-badge>
          </div>
          
          <!-- Loading Repos -->
          <div *ngIf="isLoading()" class="repo-list">
            <app-skeleton-card></app-skeleton-card>
            <app-skeleton-card></app-skeleton-card>
            <app-skeleton-card></app-skeleton-card>
          </div>

          <!-- Repo List -->
          <div *ngIf="!isLoading()" class="repo-list">
            <div 
              *ngFor="let repo of repositories()" 
              class="repo-card"
              [class.selected]="selectedRepo()?.id === repo.id"
              [class.healthy]="repo.healthScore >= 75"
              [class.warning]="repo.healthScore >= 50 && repo.healthScore < 75"
              [class.critical]="repo.healthScore < 50"
              (click)="selectRepository(repo)">
              <div class="repo-header">
                <span class="repo-name">{{ repo.name }}</span>
                <app-badge [variant]="getHealthVariant(repo.healthScore)" size="sm">
                  {{ repo.healthScore }}/100
                </app-badge>
              </div>
              <div class="repo-owner">{{ repo.owner }}</div>
              <div class="repo-meta">
                <span class="repo-language">{{ repo.primaryLanguage }}</span>
                <span>{{ repo.totalLines | number }} lines</span>
                <span *ngIf="repo.lastAnalyzedAt">Analyzed {{ formatDate(repo.lastAnalyzedAt) }}</span>
              </div>
              <app-button 
                variant="secondary" 
                size="sm" 
                [loading]="isAnalyzing()"
                (clicked)="runAnalysis(repo, $event)">
                Run Analysis
              </app-button>
            </div>
          </div>
        </div>

        <!-- Report Panel -->
        <div class="report-panel" *ngIf="selectedRepo()">
          <div class="report-header">
            <div class="report-title">
              <h2>{{ selectedRepo()!.name }} Report</h2>
              <app-badge [variant]="getHealthVariant(selectedRepo()!.healthScore)">
                Health: {{ selectedRepo()!.healthScore }}/100
              </app-badge>
            </div>
            <div class="export-actions">
              <app-button variant="outline" size="sm" (clicked)="downloadPdf()">
                Download PDF
              </app-button>
              <app-button variant="outline" size="sm" (clicked)="downloadJson()">
                Export JSON
              </app-button>
            </div>
          </div>

          <!-- Report Content -->
          <div class="report-content">
            <!-- Radar Section -->
            <div class="radar-section">
              <h3>Health Radar</h3>
              <div *ngIf="healthReportLoading()" class="radar-loading">
                <app-skeleton variant="circular" width="200px" height="200px"></app-skeleton>
              </div>
              <app-radar-chart 
                *ngIf="healthReport() && !healthReportLoading()"
                [data]="healthReport()!"
                [previousData]="previousReport()">
              </app-radar-chart>
            </div>

            <!-- Tabs -->
            <div class="tabs">
              <button 
                *ngFor="let tab of tabs; let i = index"
                class="tab"
                [class.active]="activeTab() === i"
                (click)="activeTab.set(i)">
                {{ tab }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <app-findings-list 
                *ngIf="activeTab() === 0 && healthReport()"
                [findings]="healthReport()!.findings"
                (sort)="sortFindings($event)">
              </app-findings-list>

              <div *ngIf="activeTab() === 1 && healthReport()" class="tech-debt">
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
                *ngIf="activeTab() === 2 && healthReport()"
                [recommendations]="healthReport()!.recommendations">
              </app-recommendations>
            </div>
          </div>
        </div>

        <!-- No Selection State -->
        <div class="no-selection" *ngIf="!selectedRepo() && !isLoading()">
          <div class="no-selection__content">
            <span class="no-selection__icon">📊</span>
            <p>Select a repository to view its health report</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-6);
      min-height: 100vh;
      background: var(--background);
    }

    /* Mock Mode Banner */
    .mock-banner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--warning-light);
      border: 1px solid var(--warning);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-4);
    }

    .mock-banner__icon {
      font-size: var(--text-lg);
    }

    .mock-banner__text {
      flex: 1;
      font-weight: var(--font-medium);
      color: var(--warning-dark);
    }

    .mock-banner__toggle {
      padding: var(--space-1) var(--space-3);
      background: var(--warning);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
    }

    .mock-banner__toggle:hover {
      background: var(--warning-dark);
    }

    /* Header */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
      gap: var(--space-4);
    }

    .header-content h1 {
      font-size: var(--text-3xl);
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
    }

    .header-subtitle {
      color: var(--text-secondary);
      font-size: var(--text-base);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-3);
    }

    /* Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    /* Main Content */
    .main-content {
      display: grid;
      grid-template-columns: minmax(280px, 320px) 1fr;
      gap: var(--space-6);
    }

    /* Repositories Panel */
    .repositories-panel {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .panel-header h2 {
      font-size: var(--text-lg);
      color: var(--text-primary);
      margin: 0;
    }

    .repo-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .repo-card {
      padding: var(--space-4);
      border: 2px solid var(--border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      background: var(--surface);
    }

    .repo-card:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .repo-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .repo-card.healthy {
      border-left: 4px solid var(--success);
    }

    .repo-card.warning {
      border-left: 4px solid var(--warning);
    }

    .repo-card.critical {
      border-left: 4px solid var(--danger);
    }

    .repo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .repo-name {
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      font-size: var(--text-base);
    }

    .repo-owner {
      color: var(--text-secondary);
      font-size: var(--text-sm);
      margin-bottom: var(--space-2);
    }

    .repo-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      font-size: var(--text-xs);
      color: var(--text-muted);
      margin-bottom: var(--space-3);
    }

    .repo-language {
      background: var(--gray-100);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      font-weight: var(--font-medium);
    }

    /* Report Panel */
    .report-panel {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-5);
      gap: var(--space-4);
    }

    .report-title {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .report-title h2 {
      margin: 0;
      font-size: var(--text-2xl);
      color: var(--text-primary);
    }

    .export-actions {
      display: flex;
      gap: var(--space-2);
    }

    .radar-section {
      text-align: center;
      margin: var(--space-6) 0;
    }

    .radar-section h3 {
      color: var(--text-secondary);
      font-size: var(--text-lg);
      margin-bottom: var(--space-4);
    }

    .radar-loading {
      display: flex;
      justify-content: center;
      padding: var(--space-6);
    }

    .tabs {
      display: flex;
      gap: var(--space-1);
      border-bottom: 1px solid var(--border);
      margin-bottom: var(--space-5);
    }

    .tab {
      padding: var(--space-3) var(--space-5);
      background: none;
      border: none;
      cursor: pointer;
      font-size: var(--text-base);
      font-weight: var(--font-medium);
      color: var(--text-secondary);
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);
    }

    .tab:hover {
      color: var(--primary);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .tech-debt {
      padding: var(--space-4) 0;
    }

    .tech-debt h4 {
      color: var(--text-primary);
      font-size: var(--text-lg);
      margin-bottom: var(--space-4);
    }

    .debt-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-3);
    }

    .debt-label {
      font-weight: var(--font-medium);
      color: var(--text-primary);
    }

    .debt-value {
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    /* No Selection */
    .no-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      border-radius: var(--radius-xl);
      border: 2px dashed var(--border);
      min-height: 400px;
    }

    .no-selection__content {
      text-align: center;
      color: var(--text-muted);
    }

    .no-selection__icon {
      font-size: 3rem;
      display: block;
      margin-bottom: var(--space-3);
    }

    .no-selection__content p {
      font-size: var(--text-lg);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .repositories-panel {
        max-height: 400px;
        overflow-y: auto;
      }
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: var(--space-4);
      }

      .dashboard-header {
        flex-direction: column;
        gap: var(--space-3);
      }

      .header-content h1 {
        font-size: var(--text-2xl);
      }

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .report-header {
        flex-direction: column;
      }

      .export-actions {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .stats-row {
        grid-template-columns: 1fr;
      }

      .tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .tab {
        padding: var(--space-2) var(--space-4);
        font-size: var(--text-sm);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  // Constants exposed to template
  readonly USE_MOCK_DATA = USE_MOCK_DATA;
  readonly tabs = ['Findings', 'Tech Debt', 'Recommendations'];

  // Hooks
  private reposHook = new UseRepositoriesHook(this.apiService);
  private healthHook = new UseHealthReportHook(this.apiService);
  private analysisHook = new UseAnalysisHook(this.apiService);

  // Signals for state
  repositories = this.reposHook.repositories;
  selectedRepo = signal<Repository | null>(null);
  healthReport = this.healthHook.healthReport;
  previousReport = this.healthHook.previousReport;
  healthReportLoading = this.healthHook.isLoading;
  isAnalyzing = this.analysisHook.isAnalyzing;
  activeTab = signal(0);

  // Local loading signal
  isLoading = signal(true);

  // Dashboard stats
  stats: DashboardStats = {
    averageHealthScore: 64,
    scoreTrend: 3,
    totalLinesAnalyzed: 127432,
    criticalIssues: 3,
    coverageTrend: 12
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRepositories();
  }

  loadRepositories(): void {
    this.isLoading.set(true);
    this.reposHook.loadRepositories().subscribe({
      next: (repos) => {
        this.repositories.set(repos);
        this.isLoading.set(false);
        if (repos.length > 1 && !this.selectedRepo()) {
          this.selectRepository(repos[1]);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectRepository(repo: Repository): void {
    this.selectedRepo.set(repo);
    this.loadReport(repo);
  }

  loadReport(repo: Repository): void {
    this.healthHook.loadReport(repo.owner, repo.name).subscribe();
  }

  runAnalysis(repo: Repository, event: MouseEvent): void {
    event.stopPropagation();
    this.analysisHook.runAnalysis(repo.owner, repo.name).subscribe();
  }

  refreshData(): void {
    this.loadRepositories();
  }

  downloadPdf(): void {
    if (!this.selectedRepo()) return;
    this.apiService.exportPdf(this.selectedRepo()!.owner, this.selectedRepo()!.name).subscribe(blob => {
      this.downloadBlob(blob, `health-report-${this.selectedRepo()!.name}.pdf`);
    });
  }

  downloadJson(): void {
    if (!this.selectedRepo()) return;
    this.apiService.exportJson(this.selectedRepo()!.owner, this.selectedRepo()!.name).subscribe(blob => {
      this.downloadBlob(blob, `health-report-${this.selectedRepo()!.name}.json`);
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  sortFindings(criteria: string): void {
    const report = this.healthReport();
    if (!report) return;
    
    const findings = [...report.findings];
    findings.sort((a, b) => {
      if (criteria === 'severity') {
        const order = { CRITICAL: 0, MAJOR: 1, MINOR: 2, INFO: 3 };
        return order[a.severity] - order[b.severity];
      }
      return b.complexityScore - a.complexityScore;
    });
    
    this.healthReport.set({ ...report, findings });
  }

  getHealthVariant(score: number): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
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

  toggleMockMode(): void {
    // In a real app, this would update a global state/context
    // For now, just showing how it would work
    console.log('Toggle mock mode - requires page reload to take effect');
  }
}