/*
Objectif :
Module de routage central définissant la navigation entre les différentes pages de l’application selon une structure claire et modulaire.
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchTrajetsComponent } from './public/pages/search-trajets.component';
import { TrajetDetailComponent } from './public/pages/trajet-detail.component';
import { ReservationComponent } from './reservation/pages/reservation.component';
import { UserReservationsComponent } from './user/pages/user-reservations.component';
import { TrajetFormComponent } from './admin/pages/trajet-form.component';

const routes: Routes = [
  { path: '', component: SearchTrajetsComponent },
  { path: 'trajet/:id', component: TrajetDetailComponent },
  { path: 'reservation/:id', component: ReservationComponent },
  { path: 'user/reservations', component: UserReservationsComponent },
  { path: 'admin/trajets/new', component: TrajetFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
