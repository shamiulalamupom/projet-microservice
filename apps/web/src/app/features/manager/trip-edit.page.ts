import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerApi } from './manager.api';
import { TripsApi, Trip } from '../trips/trips.api';
import { ToastService } from '../../core/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trip-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 520px;">
      <h2>Edit trip</h2>
      @if (trip) {
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-row">
            <label>From</label>
            <input class="input" type="text" formControlName="from" />
          </div>
          <div class="form-row">
            <label>To</label>
            <input class="input" type="text" formControlName="to" />
          </div>
          <div class="form-row">
            <label>Date & Time</label>
            <input class="input" type="datetime-local" formControlName="dateTime" />
          </div>
          <div class="form-row">
            <label>Total seats</label>
            <input class="input" type="number" min="1" formControlName="totalSeats" />
          </div>
          <button class="btn" type="submit" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Saving...' : 'Save changes' }}
          </button>
        </form>
      } @else if (loaded) {
        <div>Trip not found.</div>
      }
    </div>
  `,
})
export class TripEditPage implements OnInit {
  form!: ReturnType<FormBuilder['group']>;
  trip: Trip | null = null;
  loading = false;
  loaded = false;
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly managerApi: ManagerApi,
    private readonly tripsApi: TripsApi,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {
    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      dateTime: ['', Validators.required],
      totalSeats: [10, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadTrip(id);
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
        next: (trip) => {
          this.trip = trip;
          this.form.patchValue({
            from: trip.from,
            to: trip.to,
            dateTime: trip.dateTime?.slice(0, 16),
            totalSeats: trip.totalSeats,
          });
        },
        error: (err) => {
          this.toast.error(err?.error?.error?.message ?? 'Failed to load trip');
        },
      });
  }

  submit() {
    if (!this.trip || this.form.invalid) return;
    this.submitting = true;
    const raw = this.form.value;
    const payload = {
      from: raw.from ?? '',
      to: raw.to ?? '',
      dateTime: raw.dateTime ? new Date(raw.dateTime as string).toISOString() : undefined,
      totalSeats: raw.totalSeats !== null && raw.totalSeats !== undefined ? Number(raw.totalSeats) : undefined,
    };
    this.managerApi.updateTrip(this.trip.id, payload).subscribe({
      next: () => {
        this.toast.success('Trip updated');
        this.router.navigate(['/trips', this.trip!.id]);
      },
      error: (err) => {
        this.toast.error(err?.error?.error?.message ?? 'Update failed');
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }
}
