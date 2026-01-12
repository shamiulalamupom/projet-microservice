/*
Objectif :
Service métier permettant la gestion des réservations utilisateur : création, consultation et annulation des réservations.
*/

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private api: ApiService) {}

  reserve(trajetId: string) {
    return this.api.post('/reservations', { trajetId });
  }

  myReservations() {
    return this.api.get('/reservations/me');
  }

  cancel(id: string) {
    return this.api.delete(`/reservations/${id}`);
  }
}
