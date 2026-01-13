import { Component, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="toast-container">
      @for (toast of toasts(); track toast.id) {
        <div class="toast" [ngClass]="toast.type">
          <span>{{ toast.text }}</span>
          <button class="close" type="button" (click)="dismiss(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 2000;
      }
      .toast {
        min-width: 240px;
        max-width: 360px;
        padding: 0.75rem 0.9rem;
        border-radius: 6px;
        color: #0f172a;
        background: #e2e8f0;
        border: 1px solid #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .toast.success {
        background: #ecfdf3;
        border-color: #bbf7d0;
        color: #166534;
      }
      .toast.error {
        background: #fef2f2;
        border-color: #fecdd3;
        color: #991b1b;
      }
      .toast.info {
        background: #eff6ff;
        border-color: #bfdbfe;
        color: #1d4ed8;
      }
      .close {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.1rem;
        cursor: pointer;
      }
    `,
  ],
})
export class ToastComponent {
  readonly toasts = computed(() => this.toastService.toasts());

  constructor(private readonly toastService: ToastService) {}

  dismiss(id: number) {
    this.toastService.remove(id);
  }
}
