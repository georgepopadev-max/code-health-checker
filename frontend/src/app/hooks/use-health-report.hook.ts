import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { HealthReport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UseHealthReportHook {
  healthReport = signal<HealthReport | null>(null);
  previousReport = signal<HealthReport | null>(null);
  isLoading = signal(false);

  constructor(private apiService: ApiService) {}

  loadReport(owner: string, name: string): Observable<HealthReport> {
    this.isLoading.set(true);
    return this.apiService.getLatestReport(owner, name).pipe(
      tap({
        next: (report) => {
          this.previousReport.set(this.healthReport());
          this.healthReport.set(report);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  clearReport(): void {
    this.healthReport.set(null);
    this.previousReport.set(null);
  }
}