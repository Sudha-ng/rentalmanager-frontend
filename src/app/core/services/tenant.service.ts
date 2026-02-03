import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { Tenant, TenantPayload } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly resourceUrl = `${API_BASE_URL}/tenants`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.resourceUrl);
  }

  find(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.resourceUrl}/${id}`);
  }

  create(payload: TenantPayload): Observable<Tenant> {
    return this.http.post<Tenant>(this.resourceUrl, payload);
  }

  update(id: number, payload: TenantPayload): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
