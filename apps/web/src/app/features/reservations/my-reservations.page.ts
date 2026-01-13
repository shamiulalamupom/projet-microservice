import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationsApi, Reservation, ReservationsResponse } from './reservations.api';
import { ToastService } from '../../core/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-my-reservations-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <h2>My reservations</h2>
    @if (loaded && reservations.length === 0) {
      <div class="card">No reservations yet.</div>
    } @else {
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Trip</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (r of reservations; track r.id) {
            <tr>
              <td>{{ r.id }}</td>
              <td>{{ r.tripId }}</td>
              <td>{{ r.seats }}</td>
              <td><span class="badge">{{ r.status }}</span></td>
              <td>{{ r.createdAt | date: 'short' }}</td>
              <td>
                @if (canCancel(r)) {
                  <button class="btn secondary" type="button" (click)="cancel(r)" [disabled]="cancelingId === r.id">
                    Cancel
                  </button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class MyReservationsPage implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  loaded = false;
  cancelingId: string | null = null;

  constructor(private readonly reservationsApi: ReservationsApi, private readonly toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.reservationsApi
      .getMyReservations()
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

  canCancel(reservation: Reservation) {
    return reservation.status !== 'canceled' && reservation.status !== 'expired';
  }

  cancel(reservation: Reservation) {
    this.cancelingId = reservation.id;
    this.reservationsApi.cancelReservation(reservation.id).subscribe({
      next: (res) => {
        this.toast.success('Reservation canceled');
        this.reservations = this.reservations.map((r) => (r.id === res.id ? res : r));
      },
      error: (err) => {
        this.toast.error(err?.error?.error?.message ?? 'Cancel failed');
        this.cancelingId = null;
      },
      complete: () => (this.cancelingId = null),
    });
  }
}
