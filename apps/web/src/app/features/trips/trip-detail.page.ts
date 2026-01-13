import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TripsApi, Trip } from './trips.api';
import { TripCardComponent } from '../../shared/components/trip-card.component';
import { ToastService } from '../../core/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trip-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCardComponent],
  template: `
    @if (trip) {
      <app-trip-card [trip]="trip">
        <div style="margin-top:0.75rem; display:flex; gap:0.5rem;">
          <a class="btn" [routerLink]="['/book', trip.id]">Book this trip</a>
        </div>
      </app-trip-card>
    } @else if (loaded) {
      <div class="card">Trip not found.</div>
    }
  `,
})
export class TripDetailPage implements OnInit {
  trip: Trip | null = null;
  loading = false;
  loaded = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tripsApi: TripsApi,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const trip = data['tripData'] as Trip | null;
      this.trip = trip ?? null;
      this.loaded = true;
    });
  }
}
