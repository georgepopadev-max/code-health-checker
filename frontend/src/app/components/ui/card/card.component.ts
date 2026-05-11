import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card--clickable]="clickable" [class.card--selected]="selected">
      <div class="card__header" *ngIf="title">
        <h3 class="card__title">{{ title }}</h3>
        <ng-content select="[slot=header-actions]"></ng-content>
      </div>
      <div class="card__body">
        <ng-content></ng-content>
      </div>
      <div class="card__footer" *ngIf="showFooter">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: all var(--transition-fast);
    }
    
    .card--clickable {
      cursor: pointer;
    }
    
    .card--clickable:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow-md);
    }
    
    .card--selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    
    .card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      border-bottom: 1px solid var(--border);
    }
    
    .card__title {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
    
    .card__body {
      padding: var(--space-4);
    }
    
    .card__footer {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--border);
      background: var(--gray-50);
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() clickable = false;
  @Input() selected = false;
  @Input() showFooter = false;
}