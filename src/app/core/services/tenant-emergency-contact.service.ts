import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { TenantEmergencyContact, TenantEmergencyContactPayload } from '../models/tenant-emergency-contact.model';

@Injectable({ providedIn: 'root' })
export class TenantEmergencyContactService {
  private readonly resourceUrl = `${API_BASE_URL}/tenant-emergency-contacts`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<TenantEmergencyContact[]> {
    return this.http.get<TenantEmergencyContact[]>(this.resourceUrl);
  }

  find(id: number): Observable<TenantEmergencyContact> {
    return this.http.get<TenantEmergencyContact>(`${this.resourceUrl}/${id}`);
  }

  create(payload: TenantEmergencyContactPayload): Observable<TenantEmergencyContact> {
    return this.http.post<TenantEmergencyContact>(this.resourceUrl, payload);
  }

  update(id: number, payload: TenantEmergencyContactPayload): Observable<TenantEmergencyContact> {
    return this.http.put<TenantEmergencyContact>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
