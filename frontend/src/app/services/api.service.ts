import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository, HealthReport, AnalysisRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.baseUrl}/repositories`);
  }

  getRepository(owner: string, name: string): Observable<Repository> {
    return this.http.get<Repository>(`${this.baseUrl}/repositories/${owner}/${name}`);
  }

  connectRepository(request: AnalysisRequest): Observable<Repository> {
    return this.http.post<Repository>(`${this.baseUrl}/repositories/connect`, request);
  }

  triggerAnalysis(owner: string, name: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/repositories/${owner}/${name}/analyze`, {});
  }

  getLatestReport(owner: string, name: string): Observable<HealthReport> {
    return this.http.get<HealthReport>(`${this.baseUrl}/repositories/${owner}/${name}/report`);
  }

  exportPdf(owner: string, name: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/${owner}/${name}/pdf`, { responseType: 'blob' });
  }

  exportJson(owner: string, name: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/${owner}/${name}/json`, { responseType: 'blob' });
  }
}