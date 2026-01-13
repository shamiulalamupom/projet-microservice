import { Routes } from '@angular/router';
import { ShellComponent } from './core/ui/shell.component';
import { TripsListPage } from './features/trips/trips-list.page';
import { TripDetailPage } from './features/trips/trip-detail.page';
import { BookingPage } from './features/reservations/booking.page';
import { MyReservationsPage } from './features/reservations/my-reservations.page';
import { TripCreatePage } from './features/manager/trip-create.page';
import { TripEditPage } from './features/manager/trip-edit.page';
import { TripReservationsPage } from './features/manager/trip-reservations.page';
import { LoginPage } from './features/auth/login.page';
import { RegisterPage } from './features/auth/register.page';
import { authGuard } from './core/guards/auth.guard';
import { managerGuard } from './core/guards/role.guard';
import { tripDetailResolver, tripsListResolver } from './features/trips/trips.resolvers';

export const routes: Routes = [
  { path: '', redirectTo: 'trips', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'trips',
        component: TripsListPage,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: { tripsData: tripsListResolver },
      },
      {
        path: 'trips/:id',
        component: TripDetailPage,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: { tripData: tripDetailResolver },
      },
      { path: 'book/:id', component: BookingPage, canActivate: [authGuard] },
      { path: 'reservations/me', component: MyReservationsPage, canActivate: [authGuard] },
      {
        path: 'manager',
        canActivate: [authGuard, managerGuard],
        children: [
          { path: '', redirectTo: 'trips/create', pathMatch: 'full' },
          { path: 'trips/create', component: TripCreatePage },
          { path: 'trips/:id/edit', component: TripEditPage },
          { path: 'trips/:id/reservations', component: TripReservationsPage },
        ],
      },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
    ],
  },
  { path: '**', redirectTo: 'trips' },
];
