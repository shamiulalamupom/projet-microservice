import { Injectable, computed, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messages = signal<ToastMessage[]>([]);
  readonly toasts = computed(() => this.messages());

  success(text: string) {
    this.add('success', text);
  }

  error(text: string) {
    this.add('error', text);
  }

  info(text: string) {
    this.add('info', text);
  }

  remove(id: number) {
    this.messages.update((items) => items.filter((m) => m.id !== id));
  }

  private add(type: ToastType, text: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.messages.update((items) => [...items, { id, type, text }]);
    setTimeout(() => this.remove(id), 3500);
  }
}
