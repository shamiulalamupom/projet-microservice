import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ManagerApi } from './manager.api';
import { Reservation, ReservationsResponse } from '../reservations/reservations.api';
import { ToastService } from '../../core/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trip-reservations-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <h2>Trip reservations</h2>
    @if (loaded && reservations.length === 0) {
      <div class="card">No reservations for this trip.</div>
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          @for (r of reservations; track r.id) {
            <tr>
              <td>{{ r.id }}</td>
              <td>{{ r.seats }}</td>
              <td>{{ r.status }}</td>
              <td>{{ r.createdAt | date: 'short' }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class TripReservationsPage implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  loaded = false;

  constructor(
    private readonly managerApi: ManagerApi,
    private readonly route: ActivatedRoute,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  private load(id: string) {
    this.loading = true;
    this.managerApi
      .getTripReservations(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loaded = true;
        })
      )
      .subscribe({
        next: (res) => (this.reservations = this.normalize(res)),
        error: (err) => {
          this.toast.error(err?.error?.error?.message ?? 'Failed to load reservations');
        },
      });
  }

  private normalize(res: ReservationsResponse | Reservation[] | undefined) {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    return res.items ?? [];
  }
}
