import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="variantClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      font-weight: var(--font-semibold);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }
    
    /* Sizes */
    :host(.sm) .badge,
    .badge--sm {
      padding: 2px 8px;
      font-size: var(--text-xs);
    }
    
    :host(.md) .badge,
    .badge--md {
      padding: 4px 12px;
      font-size: var(--text-sm);
    }
    
    :host(.lg) .badge,
    .badge--lg {
      padding: 6px 16px;
      font-size: var(--text-base);
    }
    
    /* Variants */
    .badge--success {
      background: var(--success-light);
      color: var(--success-dark);
    }
    
    .badge--warning {
      background: var(--warning-light);
      color: var(--warning-dark);
    }
    
    .badge--danger {
      background: var(--danger-light);
      color: var(--danger-dark);
    }
    
    .badge--info {
      background: var(--primary-light);
      color: var(--primary);
    }
    
    .badge--neutral {
      background: var(--gray-100);
      color: var(--gray-700);
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: BadgeSize = 'md';

  get variantClasses(): string {
    return `badge--${this.variant} badge--${this.size}`;
  }
}