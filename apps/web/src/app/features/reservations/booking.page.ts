import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TripsApi, Trip } from '../trips/trips.api';
import { ReservationsApi, Reservation } from './reservations.api';
import { TripCardComponent } from '../../shared/components/trip-card.component';
import { ToastService } from '../../core/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TripCardComponent],
  template: `
    <h2>Book trip</h2>
    @if (trip) {
      <app-trip-card [trip]="trip"></app-trip-card>

      <div class="card" style="margin-top:1rem; max-width: 420px;">
        <h3>Booking summary</h3>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-row">
            <label>Seats</label>
            <input class="input" type="number" formControlName="seats" min="1" />
          </div>
          <button class="btn" type="submit" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Booking...' : 'Confirm booking' }}
          </button>
        </form>
        @if (reservation) {
          <div class="card" style="margin-top:0.75rem; background:#ecfdf3; border-color:#bbf7d0;">
            <div><strong>Reservation created</strong></div>
            <div>ID: {{ reservation.id }}</div>
            <div>Status: {{ reservation.status }}</div>
          </div>
        }
      </div>
    } @else if (loaded) {
      <div class="card">Trip not found.</div>
    }
  `,
})
export class BookingPage implements OnInit {
  trip: Trip | null = null;
  reservation: Reservation | null = null;
  loading = false;
  loaded = false;
  submitting = false;

  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly tripsApi: TripsApi,
    private readonly reservationsApi: ReservationsApi,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      seats: [1, [Validators.required, Validators.min(1)]],
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrip(id);
    }
  }

  private loadTrip(id: string) {
    this.loading = true;
    this.tripsApi
      .getTrip(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loaded = true;
        })
      )
      .subscribe({
        next: (trip) => (this.trip = trip),
        error: (err) => {
          this.toast.error(err?.error?.error?.message ?? 'Failed to load trip');
          this.trip = null;
        },
      });
  }

  submit() {
    if (!this.trip || this.form.invalid) return;
    this.submitting = true;
    this.reservation = null;

    const payload = { tripId: this.trip.id, seats: this.form.value.seats ?? 1 };
    this.reservationsApi.createReservation(payload).subscribe({
      next: (res) => {
        this.reservation = res;
        this.toast.success('Reservation created');
      },
      error: (err) => {
        const msg = err?.error?.error?.message ?? 'Booking failed';
        this.toast.error(msg === 'NO_SEATS' ? 'No seats available' : msg);
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }
}
