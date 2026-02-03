import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { Income, IncomePayload } from '../models/income.model';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly resourceUrl = `${API_BASE_URL}/income`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Income[]> {
    return this.http.get<Income[]>(this.resourceUrl);
  }

  find(id: number): Observable<Income> {
    return this.http.get<Income>(`${this.resourceUrl}/${id}`);
  }

  create(payload: IncomePayload): Observable<Income> {
    return this.http.post<Income>(this.resourceUrl, payload);
  }

  update(id: number, payload: IncomePayload): Observable<Income> {
    return this.http.put<Income>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
