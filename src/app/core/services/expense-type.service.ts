import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { ExpenseType, ExpenseTypePayload } from '../models/expense-type.model';

@Injectable({ providedIn: 'root' })
export class ExpenseTypeService {
  private readonly resourceUrl = `${API_BASE_URL}/expense-types`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<ExpenseType[]> {
    return this.http.get<ExpenseType[]>(this.resourceUrl);
  }

  find(id: number): Observable<ExpenseType> {
    return this.http.get<ExpenseType>(`${this.resourceUrl}/${id}`);
  }

  create(payload: ExpenseTypePayload): Observable<ExpenseType> {
    return this.http.post<ExpenseType>(this.resourceUrl, payload);
  }

  update(id: number, payload: ExpenseTypePayload): Observable<ExpenseType> {
    return this.http.put<ExpenseType>(`${this.resourceUrl}/${id}`, payload);
  }
}
