import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Trip {
  id: string;
  from: string;
  to: string;
  dateTime: string;
  totalSeats: number;
  availableSeats: number;
}

export interface TripsResponse {
  items: Trip[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class TripsApi {
  constructor(private readonly http: HttpClient) {}

  getTrips(params: { from?: string; to?: string; date?: string; page?: number; pageSize?: number }) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value as any);
      }
    });
    return this.http.get<TripsResponse | Trip[]>(`${environment.apiBaseUrl}/trips`, {
      params: httpParams,
    });
  }

  getTrip(id: string) {
    return this.http.get<Trip>(`${environment.apiBaseUrl}/trips/${id}`);
  }
}
