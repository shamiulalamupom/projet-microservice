import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { TripsApi, Trip, TripsResponse } from './trips.api';
import { TripCardComponent } from '../../shared/components/trip-card.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-trips-list-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TripCardComponent, PaginationComponent],
  template: `
    <h2>Available trips</h2>
    <form class="card" [formGroup]="form" (ngSubmit)="applyFilters()">
      <div style="display:flex; gap: 0.75rem; flex-wrap: wrap;">
        <div class="form-row" style="flex:1 1 180px;">
          <label>From</label>
          <input class="input" type="text" formControlName="from" placeholder="City" />
        </div>
        <div class="form-row" style="flex:1 1 180px;">
          <label>To</label>
          <input class="input" type="text" formControlName="to" placeholder="City" />
        </div>
        <div class="form-row" style="flex:1 1 180px;">
          <label>Date</label>
          <input class="input" type="date" formControlName="date" />
        </div>
        <div class="form-row" style="align-self:flex-end;">
          <button class="btn" type="submit">Filter</button>
        </div>
      </div>
    </form>

    <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">
      @if (loaded && trips.length === 0) {
        <div class="card">No trips found.</div>
      } @else {
        @for (trip of trips; track trip.id) {
          <app-trip-card [trip]="trip">
            <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
              <a class="btn secondary" [routerLink]="['/trips', trip.id]">Details</a>
            </div>
          </app-trip-card>
        }
      }
    </div>

    <app-pagination
      [page]="page"
      [pageSize]="pageSize"
      [total]="total"
      (pageChange)="onPageChange($event)"
    ></app-pagination>
  `,
})
export class TripsListPage implements OnInit, OnDestroy {
  form!: ReturnType<FormBuilder['group']>;
  trips: Trip[] = [];
  loading = false;
  loaded = false;
  total = 0;
  page = 1;
  pageSize = 5;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tripsApi: TripsApi,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      from: [''],
      to: [''],
      date: [''],
    });
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.applyQueryParams(this.route.snapshot.queryParams);
      const res = data['tripsData'] as TripsResponse | Trip[] | undefined;
      if (res) {
        const parsed = this.normalizeResponse(res);
        this.trips = parsed.items;
        this.total = parsed.total;
        this.page = parsed.page;
        this.pageSize = parsed.pageSize;
        this.loaded = true;
      }
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.applyQueryParams(params);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    this.page = 1;
    this.navigateWithQuery();
  }

  onPageChange(page: number) {
    this.page = page;
    this.navigateWithQuery();
  }

  private navigateWithQuery() {
    const query = { ...this.form.value, page: this.page, pageSize: this.pageSize } as any;
    this.router.navigate([], { relativeTo: this.route, queryParams: query, queryParamsHandling: 'merge' });
  }

  private applyQueryParams(params: any) {
    this.page = parseInt(params['page'] ?? '1', 10) || 1;
    this.pageSize = parseInt(params['pageSize'] ?? '5', 10) || 5;
    this.form.patchValue(
      {
        from: params['from'] ?? '',
        to: params['to'] ?? '',
        date: params['date'] ?? '',
      },
      { emitEvent: false }
    );
  }

  private normalizeResponse(res: TripsResponse | Trip[]) {
    if (Array.isArray(res)) {
      return {
        items: res,
        total: res.length,
        page: this.page,
        pageSize: this.pageSize,
      };
    }
    return {
      items: res.items ?? [],
      total: res.total ?? res.items?.length ?? 0,
      page: res.page ?? this.page,
      pageSize: res.pageSize ?? this.pageSize,
    };
  }
}
