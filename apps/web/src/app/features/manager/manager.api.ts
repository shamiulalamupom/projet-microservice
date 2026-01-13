import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Trip } from '../trips/trips.api';
import { Reservation } from '../reservations/reservations.api';

@Injectable({ providedIn: 'root' })
export class ManagerApi {
  constructor(private readonly http: HttpClient) {}

  createTrip(body: { from: string; to: string; dateTime: string; totalSeats: number }) {
    return this.http.post<Trip>(`${environment.apiBaseUrl}/manager/trips`, body);
  }

  updateTrip(
    id: string,
    body: { from?: string; to?: string; dateTime?: string; totalSeats?: number }
  ) {
    return this.http.put<Trip>(`${environment.apiBaseUrl}/manager/trips/${id}`, body);
  }

  getTripReservations(id: string) {
    return this.http.get<Reservation[]>(`${environment.apiBaseUrl}/manager/trips/${id}/reservations`);
  }
}
