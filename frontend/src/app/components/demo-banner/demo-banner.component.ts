import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-banner">
      <span class="banner-icon">⚠️</span>
      <span class="banner-text">DEMO PROJECT - Analysis data is simulated for portfolio demonstration</span>
      <span class="banner-badge">FICTIONAL</span>
    </div>
  `,
  styles: [`
    .demo-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-bottom: 2px solid #f39c12;
      flex-shrink: 0;
    }
    .banner-icon { font-size: 18px; }
    .banner-text {
      font-size: 13px;
      color: #f39c12;
      font-weight: 600;
    }
    .banner-badge {
      background: #f39c1230;
      color: #f39c12;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid #f39c12;
    }
  `]
})
export class DemoBannerComponent {}