import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { Lease, LeasePayload } from '../models/lease.model';

@Injectable({ providedIn: 'root' })
export class LeaseService {
  private readonly resourceUrl = `${API_BASE_URL}/leases`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.resourceUrl);
  }

  find(id: number): Observable<Lease> {
    return this.http.get<Lease>(`${this.resourceUrl}/${id}`);
  }

  create(payload: LeasePayload): Observable<Lease> {
    return this.http.post<Lease>(this.resourceUrl, payload);
  }

  update(id: number, payload: LeasePayload): Observable<Lease> {
    return this.http.put<Lease>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
