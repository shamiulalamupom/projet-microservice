import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerApi } from './manager.api';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-trip-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card" style="max-width: 520px;">
      <h2>Create trip</h2>
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
          {{ submitting ? 'Creating...' : 'Create trip' }}
        </button>
      </form>
    </div>
  `,
})
export class TripCreatePage {
  submitting = false;
  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly managerApi: ManagerApi,
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

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const raw = this.form.value;
    const payload = {
      from: raw.from ?? '',
      to: raw.to ?? '',
      dateTime: raw.dateTime ? new Date(raw.dateTime as string).toISOString() : '',
      totalSeats: Number(raw.totalSeats ?? 0),
    };
    this.managerApi.createTrip(payload).subscribe({
      next: () => {
        this.toast.success('Trip created');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        this.toast.error(err?.error?.error?.message ?? 'Failed to create trip');
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }
}
