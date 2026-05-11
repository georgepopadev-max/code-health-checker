import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton"
      [ngClass]="variantClasses"
      [style.width]="width"
      [style.height]="height">
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--gray-200) 25%,
        var(--gray-100) 50%,
        var(--gray-200) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    .skeleton--text {
      border-radius: var(--radius-sm);
      height: 1em;
    }
    
    .skeleton--circular {
      border-radius: 50%;
    }
    
    .skeleton--rectangular {
      border-radius: var(--radius-md);
    }
  `]
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() width?: string;
  @Input() height?: string;

  get variantClasses(): string {
    return `skeleton--${this.variant}`;
  }
}

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="skeleton-card">
      <div class="skeleton-card__header">
        <app-skeleton variant="text" width="40%"></app-skeleton>
        <app-skeleton variant="rectangular" width="60px" height="24px"></app-skeleton>
      </div>
      <app-skeleton variant="text" width="70%"></app-skeleton>
      <div class="skeleton-card__meta">
        <app-skeleton variant="text" width="30%"></app-skeleton>
        <app-skeleton variant="text" width="40%"></app-skeleton>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      border: 2px solid var(--border);
    }
    
    .skeleton-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .skeleton-card__meta {
      display: flex;
      gap: var(--space-4);
      margin-top: var(--space-3);
    }
  `]
})
export class SkeletonCardComponent {}

@Component({
  selector: 'app-skeleton-metrics',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="skeleton-metrics">
      <app-skeleton variant="rectangular" height="80px"></app-skeleton>
      <app-skeleton variant="rectangular" height="80px"></app-skeleton>
      <app-skeleton variant="rectangular" height="80px"></app-skeleton>
      <app-skeleton variant="rectangular" height="80px"></app-skeleton>
    </div>
  `,
  styles: [`
    .skeleton-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-4);
    }
  `]
})
export class SkeletonMetricsComponent {}