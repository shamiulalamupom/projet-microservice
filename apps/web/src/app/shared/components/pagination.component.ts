import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button class="btn secondary" type="button" (click)="change(page - 1)" [disabled]="page <= 1">Prev</button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button class="btn secondary" type="button" (click)="change(page + 1)" [disabled]="page >= totalPages">Next</button>
    </div>
  `,
  styles: [
    `
      .pagination {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  change(page: number) {
    const next = Math.min(Math.max(page, 1), this.totalPages);
    if (next !== this.page) this.pageChange.emit(next);
  }
}
