import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { Expense, ExpenseFilter, ExpensePayload } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly resourceUrl = `${API_BASE_URL}/expenses`;

  constructor(private readonly http: HttpClient) {}

  list(filter?: ExpenseFilter): Observable<Expense[]> {
    const params = this.buildParams(filter);
    return this.http.get<Expense[]>(this.resourceUrl, { params });
  }

  find(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.resourceUrl}/${id}`);
  }

  create(payload: ExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(this.resourceUrl, payload);
  }

  update(id: number, payload: ExpensePayload): Observable<Expense> {
    return this.http.put<Expense>(`${this.resourceUrl}/${id}`, payload);
  }

  private buildParams(filter?: ExpenseFilter): HttpParams {
    let params = new HttpParams();

    if (!filter) {
      return params;
    }

    if (filter.search) {
      params = params.set('search', filter.search);
    }

    if (filter.expenseTypeId !== undefined && filter.expenseTypeId !== null) {
      params = params.set('expenseTypeId', String(filter.expenseTypeId));
    }

    if (filter.propertyId !== undefined && filter.propertyId !== null) {
      params = params.set('propertyId', String(filter.propertyId));
    }

    return params;
  }
}
