import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';
import { Property, PropertyPayload } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly resourceUrl = `${API_BASE_URL}/properties`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Property[]> {
    return this.http.get<Property[]>(this.resourceUrl);
  }

  find(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.resourceUrl}/${id}`);
  }

  create(payload: PropertyPayload): Observable<Property> {
    return this.http.post<Property>(this.resourceUrl, payload);
  }

  update(id: number, payload: PropertyPayload): Observable<Property> {
    return this.http.put<Property>(`${this.resourceUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
