import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Legend, Tooltip } from 'chart.js';
import { HealthReport } from '../../models';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radar-container">
      <canvas id="radarChart"></canvas>
    </div>
  `,
  styles: [`
    .radar-container {
      width: 400px;
      height: 400px;
      margin: 0 auto;
    }
  `]
})
export class RadarChartComponent implements OnInit {
  @Input() data!: HealthReport;
  @Input() previousData: HealthReport | null = null;

  private chart: Chart | null = null;

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = ['Coverage', 'Complexity', 'Duplication', 'Documentation', 'Security', 'Maintainability'];
    const currentData = [
      this.data.coverageScore,
      this.data.complexityScore,
      this.data.duplicationScore,
      this.data.documentationScore,
      this.data.securityScore,
      this.data.maintainabilityScore
    ];

    const datasets: any[] = [
      {
        label: 'Current',
        data: currentData,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointRadius: 5
      }
    ];

    if (this.previousData) {
      datasets.push({
        label: 'Previous',
        data: [
          this.previousData.coverageScore,
          this.previousData.complexityScore,
          this.previousData.duplicationScore,
          this.previousData.documentationScore,
          this.previousData.securityScore,
          this.previousData.maintainabilityScore
        ],
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderColor: '#9ca3af',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#9ca3af',
        pointRadius: 4
      });
    }

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent'
            },
            grid: { color: 'rgba(0,0,0,0.1)' },
            angleLines: { color: 'rgba(0,0,0,0.1)' },
            pointLabels: {
              font: { size: 12, weight: '500' },
              color: '#374151'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, usePointStyle: true }
          }
        }
      }
    });
  }
}