import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Trip } from '../../features/trips/trips.api';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="card trip-card">
      <div class="header">
        <div class="route">{{ trip.from }} → {{ trip.to }}</div>
        <div class="date">{{ trip.dateTime | date: 'medium' }}</div>
      </div>
      <div class="stats">
        <div class="seats">Available: {{ trip.availableSeats }} / {{ trip.totalSeats }}</div>
        <div class="fill">
          <div class="bar">
            <div class="bar-fill" [style.width.%]="fillPercent"></div>
          </div>
          <span class="percent">{{ fillPercent | number: '1.0-0' }}% filled</span>
        </div>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .trip-card {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }
      .route {
        font-size: 1.1rem;
        font-weight: 700;
      }
      .date {
        color: #4b5563;
        font-size: 0.95rem;
      }
      .stats {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .seats {
        font-weight: 600;
      }
      .fill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .bar {
        height: 8px;
        background: #e5e7eb;
        border-radius: 9999px;
        width: 140px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #2563eb, #10b981);
      }
      .percent {
        color: #4b5563;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class TripCardComponent {
  @Input() trip!: Trip;

  get fillPercent(): number {
    if (!this.trip || !this.trip.totalSeats) return 0;
    const reserved = this.trip.totalSeats - this.trip.availableSeats;
    return Math.min(100, Math.max(0, (reserved / this.trip.totalSeats) * 100));
  }
}
