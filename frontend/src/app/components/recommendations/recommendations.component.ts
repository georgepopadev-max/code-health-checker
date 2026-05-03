import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recommendation } from '../../models';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations">
      <div class="recommendation-item" *ngFor="let rec of recommendations">
        <div class="rec-priority">
          <span class="priority-number">{{ rec.priority }}</span>
        </div>
        <div class="rec-content">
          <h4 class="rec-title">{{ rec.title }}</h4>
          <p class="rec-description">{{ rec.description }}</p>
          <div class="rec-meta">
            <span class="category-tag">{{ rec.category }}</span>
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              {{ rec.estimatedHours }}h estimated
            </span>
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              +{{ rec.healthScoreImpact }} health score
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommendations { padding: 8px 0; }
    .recommendation-item {
      display: flex;
      gap: 16px;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .rec-priority {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-radius: 50%;
      flex-shrink: 0;
    }
    .priority-number {
      color: white;
      font-weight: 700;
      font-size: 14px;
    }
    .rec-content { flex: 1; }
    .rec-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }
    .rec-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 12px 0;
      line-height: 1.5;
    }
    .rec-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .category-tag {
      padding: 4px 10px;
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #9ca3af;
    }
    .meta-item svg { color: #6b7280; }
  `]
})
export class RecommendationsComponent {
  @Input() recommendations: Recommendation[] = [];
}