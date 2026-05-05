import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Repository, HealthReport, AnalysisRequest } from '../models';
import { MOCK_REPOSITORIES, MOCK_HEALTH_REPORT } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private timeoutMs = 5000;

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    const vercelEnv = (window as any).__VERCEL_ENV__;
    if (vercelEnv?.API_URL_BACK) {
      return vercelEnv.API_URL_BACK;
    }
    return '/api';
  }

  private get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.getApiUrl()}${path}`).pipe(
      timeout(this.timeoutMs),
      catchError(() => of(undefined as T))
    );
  }

  private post<T, B = any>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.getApiUrl()}${path}`, body).pipe(
      timeout(this.timeoutMs),
      catchError(() => of(undefined as T))
    );
  }

  getRepositories(): Observable<Repository[]> {
    const result = this.get<Repository[]>(`/repositories`);
    return result.pipe(catchError(() => of(MOCK_REPOSITORIES)));
  }

  getRepository(owner: string, name: string): Observable<Repository> {
    return this.get<Repository>(`/repositories/${owner}/${name}`).pipe(
      catchError(() => {
        const found = MOCK_REPOSITORIES.find(r => r.owner === owner && r.name === name);
        return of(found || MOCK_REPOSITORIES[0]);
      })
    );
  }

  connectRepository(request: AnalysisRequest): Observable<Repository> {
    return this.post<Repository, AnalysisRequest>(`/repositories/connect`, request).pipe(
      catchError(() => of(MOCK_REPOSITORIES[0]))
    );
  }

  triggerAnalysis(owner: string, name: string): Observable<void> {
    return this.post<void, {}>(`/repositories/${owner}/${name}/analyze`, {}).pipe(
      catchError(() => of(undefined as void))
    );
  }

  getLatestReport(owner: string, name: string): Observable<HealthReport> {
    return this.get<HealthReport>(`/repositories/${owner}/${name}/report`).pipe(
      catchError(() => of(MOCK_HEALTH_REPORT))
    );
  }

  exportPdf(owner: string, name: string): Observable<Blob> {
    return this.http.get(`${this.getApiUrl()}/export/${owner}/${name}/pdf`, { responseType: 'blob' }).pipe(
      timeout(this.timeoutMs),
      catchError(() => of(new Blob() as Blob))
    );
  }

  exportJson(owner: string, name: string): Observable<Blob> {
    return this.http.get(`${this.getApiUrl()}/export/${owner}/${name}/json`, { responseType: 'blob' }).pipe(
      timeout(this.timeoutMs),
      catchError(() => of(new Blob() as Blob))
    );
  }
}
