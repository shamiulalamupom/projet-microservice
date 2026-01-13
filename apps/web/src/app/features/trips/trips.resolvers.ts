import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { TripsApi, TripsResponse, Trip } from './trips.api';
import { catchError, of } from 'rxjs';

export const tripsListResolver: ResolveFn<TripsResponse | Trip[]> = (route: ActivatedRouteSnapshot) => {
  const api = inject(TripsApi);
  const query = {
    from: route.queryParams['from'],
    to: route.queryParams['to'],
    date: route.queryParams['date'],
    page: route.queryParams['page'],
    pageSize: route.queryParams['pageSize'],
  };
  return api.getTrips(query).pipe(catchError(() => of({ items: [], total: 0, page: 1, pageSize: 5 })));
};

export const tripDetailResolver: ResolveFn<Trip | null> = (route: ActivatedRouteSnapshot) => {
  const api = inject(TripsApi);
  const id = route.paramMap.get('id') ?? '';
  if (!id) return of(null);
  return api.getTrip(id).pipe(catchError(() => of(null)));
};
