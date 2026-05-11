import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      class="btn"
      [ngClass]="variantClasses"
      [disabled]="disabled || loading"
      (click)="handleClick($event)">
      <span *ngIf="loading" class="btn__spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-family: inherit;
      font-weight: var(--font-medium);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Sizes */
    .btn--sm {
      padding: 6px 12px;
      font-size: var(--text-sm);
    }
    
    .btn--md {
      padding: 10px 20px;
      font-size: var(--text-base);
    }
    
    .btn--lg {
      padding: 12px 24px;
      font-size: var(--text-lg);
    }
    
    /* Variants */
    .btn--primary {
      background: var(--primary);
      color: white;
    }
    
    .btn--primary:hover:not(:disabled) {
      background: var(--primary-hover);
    }
    
    .btn--secondary {
      background: var(--gray-100);
      color: var(--text-primary);
    }
    
    .btn--secondary:hover:not(:disabled) {
      background: var(--gray-200);
    }
    
    .btn--outline {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    
    .btn--outline:hover:not(:disabled) {
      background: var(--primary-light);
    }
    
    .btn--ghost {
      background: transparent;
      color: var(--text-secondary);
    }
    
    .btn--ghost:hover:not(:disabled) {
      background: var(--gray-100);
    }
    
    .btn--danger {
      background: var(--danger);
      color: white;
    }
    
    .btn--danger:hover:not(:disabled) {
      background: var(--danger-dark);
    }
    
    .btn__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  get variantClasses(): string {
    return `btn--${this.variant} btn--${this.size}`;
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}