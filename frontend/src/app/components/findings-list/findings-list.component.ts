import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Finding } from '../../models';

@Component({
  selector: 'app-findings-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="findings-list">
      <div class="findings-header">
        <span class="sort-label">Sort by:</span>
        <button class="sort-btn" [class.active]="sortCriteria === 'severity'" (click)="onSort('severity')">Severity</button>
        <button class="sort-btn" [class.active]="sortCriteria === 'complexity'" (click)="onSort('complexity')">Complexity</button>
      </div>
      <div class="finding-item" *ngFor="let finding of findings" [class]="finding.severity.toLowerCase()">
        <div class="finding-severity">
          <span class="severity-badge" [class]="finding.severity.toLowerCase()">{{ finding.severity }}</span>
        </div>
        <div class="finding-details">
          <div class="finding-method">{{ finding.methodName || finding.className }}</div>
          <div class="finding-file">{{ finding.filePath }}</div>
          <div class="finding-meta">
            <span>Complexity: {{ finding.complexityScore }}</span>
            <span>{{ finding.linesOfCode }} lines</span>
            <span>Est. {{ finding.effortHours }}h</span>
          </div>
        </div>
        <button class="view-code-btn">View Code</button>
      </div>
    </div>
  `,
  styles: [`
    .findings-list { padding: 8px 0; overflow-x: auto; }
    .findings-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .sort-label { font-size: 13px; color: #6b7280; }
    .sort-btn {
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
    .sort-btn.active { background: #4f46e5; color: white; border-color: #4f46e5; }
    .finding-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .finding-item.critical { border-left: 4px solid #ef4444; }
    .finding-item.major { border-left: 4px solid #eab308; }
    .finding-item.minor { border-left: 4px solid #3b82f6; }
    .severity-badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .severity-badge.critical { background: #fee2e2; color: #991b1b; }
    .severity-badge.major { background: #fef9c3; color: #854d0e; }
    .severity-badge.minor { background: #dbeafe; color: #1e40af; }
    .finding-details { flex: 1; }
    .finding-method { font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
    .finding-file { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
    .finding-meta { display: flex; gap: 16px; font-size: 12px; color: #9ca3af; }
    .view-code-btn {
      padding: 8px 16px;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .view-code-btn:hover { background: #e5e7eb; }
  `]
})
export class FindingsListComponent {
  @Input() findings: Finding[] = [];
  @Output() sort = new EventEmitter<string>();

  sortCriteria = 'severity';

  onSort(criteria: string) {
    this.sortCriteria = criteria;
    this.sort.emit(criteria);
  }
}