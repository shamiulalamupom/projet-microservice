/*
Objectif :
Composant de l’espace gestionnaire permettant la création et la modification de trajets via un formulaire réactif validé.
*/

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TrajetService } from '../../core/services/trajet.service';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="departure" placeholder="Départ">
      <input formControlName="arrival" placeholder="Arrivée">
      <input type="date" formControlName="date">
      <input type="number" formControlName="capacity">
      <button>Créer</button>
    </form>
  `
})
export class TrajetFormComponent {
  form = this.fb.group({
    departure: ['', Validators.required],
    arrival: ['', Validators.required],
    date: ['', Validators.required],
    capacity: [1, Validators.min(1)]
  });

  constructor(private fb: FormBuilder, private service: TrajetService) {}

  submit() {
    this.service.create(this.form.value).subscribe();
  }
}
