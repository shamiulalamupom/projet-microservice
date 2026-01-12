/*
Objectif :
Module racine de l’application Angular regroupant les composants, services, modules et intercepteurs nécessaires au fonctionnement global du front-end.
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { SearchTrajetsComponent } from './public/pages/search-trajets.component';
import { TrajetDetailComponent } from './public/pages/trajet-detail.component';
import { ReservationComponent } from './reservation/pages/reservation.component';
import { UserReservationsComponent } from './user/pages/user-reservations.component';
import { TrajetFormComponent } from './admin/pages/trajet-form.component';

@NgModule({
  declarations: [
    SearchTrajetsComponent,
    TrajetDetailComponent,
    ReservationComponent,
    UserReservationsComponent,
    TrajetFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [SearchTrajetsComponent]
})
export class AppModule {}
