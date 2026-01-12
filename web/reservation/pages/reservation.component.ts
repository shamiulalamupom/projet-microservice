/*
Objectif :
Composant du tunnel de réservation permettant à l’utilisateur de confirmer la réservation d’un trajet sélectionné.
*/

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  template: `
    <h3>Confirmation de réservation</h3>
    <button (click)="confirm()">Confirmer</button>
  `
})
export class ReservationComponent {
  trajetId = this.route.snapshot.params['id'];

  constructor(
    private route: ActivatedRoute,
    private service: ReservationService,
    private router: Router
  ) {}

  confirm() {
    this.service.reserve(this.trajetId).subscribe(() => {
      this.router.navigate(['/user/reservations']);
    });
  }
}
