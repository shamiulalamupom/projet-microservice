import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../core/ui/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card" style="max-width: 480px; margin: 2rem auto;">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-row">
          <label>Email</label>
          <input class="input" type="email" formControlName="email" required />
        </div>
        <div class="form-row">
          <label>Password</label>
          <input class="input" type="password" formControlName="password" required />
        </div>
        <div class="form-row">
          <button class="btn" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </div>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register</a></p>
    </div>
  `,
})
export class LoginPage implements OnInit {
  loading = false;
  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.toast.success('Logged in successfully');
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        this.toast.error(err?.error?.error?.message ?? 'Login failed');
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
