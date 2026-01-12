/*
Objectif :
Composant de l’espace utilisateur affichant la liste des réservations de l’utilisateur connecté, leur statut et les actions associées (annulation).
*/

import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  template: `
    <h2>Mes réservations</h2>
    <div *ngFor="let r of reservations">
      {{ r.trajet.departure }} → {{ r.trajet.arrival }}
      <span>{{ r.status }}</span>
      <button (click)="cancel(r._id)">Annuler</button>
    </div>
  `
})
export class UserReservationsComponent implements OnInit {
  reservations: any[] = [];

  constructor(private service: ReservationService) {}

  ngOnInit() {
    this.service.myReservations().subscribe(r => this.reservations = r as any[]);
  }

  cancel(id: string) {
    this.service.cancel(id).subscribe(() => this.ngOnInit());
  }
}
