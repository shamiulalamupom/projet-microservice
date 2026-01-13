import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Reservation {
  id: string;
  tripId: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'expired';
  createdAt: string;
}

export interface ReservationsResponse {
  items: Reservation[];
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class ReservationsApi {
  constructor(private readonly http: HttpClient) {}

  createReservation(body: { tripId: string; seats: number }) {
    return this.http.post<Reservation>(`${environment.apiBaseUrl}/reservations`, body);
  }

  getMyReservations() {
    return this.http.get<ReservationsResponse | Reservation[]>(`${environment.apiBaseUrl}/reservations/me`);
  }

  cancelReservation(id: string) {
    return this.http.post<Reservation>(`${environment.apiBaseUrl}/reservations/${id}/cancel`, {});
  }
}
