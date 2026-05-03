import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metrics-card" [class.highlight]="highlight">
      <div class="card-title">{{ title }}</div>
      <div class="card-value">
        <span class="value">{{ value }}</span>
        <span class="suffix" *ngIf="suffix">{{ suffix }}</span>
      </div>
      <div class="card-trend" *ngIf="trend !== undefined">
        <span class="trend-arrow" [class.up]="trend >= 0" [class.down]="trend < 0">
          {{ trend >= 0 ? '↑' : '↓' }}
        </span>
        <span class="trend-value" [class.positive]="trend >= 0" [class.negative]="trend < 0">
          {{ trend >= 0 ? '+' : '' }}{{ trend }}{{ trendLabel ? '' : '%' }}
        </span>
        <span class="trend-label" *ngIf="trendLabel">{{ trendLabel }}</span>
      </div>
    </div>
  `,
  styles: [`
    .metrics-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .metrics-card.highlight { border: 2px solid #ef4444; }
    .card-title {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-value {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .suffix {
      font-size: 16px;
      color: #6b7280;
    }
    .card-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 13px;
    }
    .trend-arrow {
      font-size: 14px;
    }
    .trend-arrow.up { color: #22c55e; }
    .trend-arrow.down { color: #ef4444; }
    .trend-value.positive { color: #22c55e; }
    .trend-value.negative { color: #ef4444; }
    .trend-label { color: #9ca3af; }
  `]
})
export class MetricsCardComponent {
  @Input() title = '';
  @Input() value: number = 0;
  @Input() suffix = '';
  @Input() trend?: number;
  @Input() trendLabel = '';
  @Input() highlight = false;
  @Input() format = 'number';
}