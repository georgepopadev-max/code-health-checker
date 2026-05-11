import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Repository, HealthReport } from '../models';

// Simulates delay for loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable({
  providedIn: 'root'
})
export class UseRepositoriesHook {
  // Signals for state
  repositories = signal<Repository[]>([]);
  selectedRepo = signal<Repository | null>(null);
  isLoading = signal(false);

  constructor(private apiService: ApiService) {}

  loadRepositories(): Observable<Repository[]> {
    this.isLoading.set(true);
    return this.apiService.getRepositories().pipe(
      tap({
        next: (repos) => {
          this.repositories.set(repos);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  selectRepository(repo: Repository): void {
    this.selectedRepo.set(repo);
  }

  clearSelection(): void {
    this.selectedRepo.set(null);
  }
}