/*
Objectif :
Composant de l’espace public permettant la recherche et l’affichage paginé des trajets disponibles selon des critères définis par l’utilisateur.
*/

import { Component, OnInit } from '@angular/core';
import { TrajetService } from '../../core/services/trajet.service';

@Component({
  selector: 'app-search-trajets',
  template: `
    <input [(ngModel)]="filters.departure" placeholder="Départ">
    <input [(ngModel)]="filters.arrival" placeholder="Arrivée">
    <button (click)="search()">Rechercher</button>

    <div *ngFor="let t of trajets">
      <a [routerLink]="['/trajet', t._id]">
        {{ t.departure }} → {{ t.arrival }}
      </a>
    </div>
  `
})
export class SearchTrajetsComponent implements OnInit {
  trajets: any[] = [];
  filters: any = {};

  constructor(private trajetService: TrajetService) {}

  ngOnInit() {
    this.search();
  }

  search() {
    this.trajetService.search(this.filters).subscribe(res => {
      this.trajets = res as any[];
    });
  }
}
