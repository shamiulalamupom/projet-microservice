/*
Objectif :
Composant chargé d’afficher le détail d’un trajet sélectionné et de rediriger l’utilisateur vers le tunnel de réservation.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrajetService } from '../../core/services/trajet.service';

@Component({
  template: `
    <h2>{{ trajet?.departure }} → {{ trajet?.arrival }}</h2>
    <p>Date : {{ trajet?.date }}</p>
    <button (click)="reserver()">Réserver</button>
  `
})
export class TrajetDetailComponent implements OnInit {
  trajet: any;

  constructor(
    private route: ActivatedRoute,
    private trajetService: TrajetService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.trajetService.getById(id).subscribe(t => this.trajet = t);
  }

  reserver() {
    this.router.navigate(['/reservation', this.trajet._id]);
  }
}
