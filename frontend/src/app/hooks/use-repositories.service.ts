import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Repository } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UseRepositoriesService {
  constructor(private apiService: ApiService) {}

  execute(): Observable<Repository[]> {
    return this.apiService.getRepositories();
  }
}