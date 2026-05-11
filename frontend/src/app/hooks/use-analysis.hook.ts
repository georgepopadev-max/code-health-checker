import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UseAnalysisHook {
  isAnalyzing = signal(false);
  analysisError = signal<string | null>(null);

  constructor(private apiService: ApiService) {}

  runAnalysis(owner: string, name: string): Observable<void> {
    this.isAnalyzing.set(true);
    this.analysisError.set(null);
    
    return this.apiService.triggerAnalysis(owner, name).pipe(
      tap({
        next: () => {
          this.isAnalyzing.set(false);
        },
        error: (err) => {
          this.isAnalyzing.set(false);
          this.analysisError.set(err?.message || 'Analysis failed');
        }
      })
    );
  }

  clearError(): void {
    this.analysisError.set(null);
  }
}