import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <a routerLink="/" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </a>
          <a routerLink="/" class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Lost & Found</span>
          </a>
        </div>

        <h1>Welcome back</h1>
        <p class="subtitle">Sign in to continue</p>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              required
              placeholder="your@email.com"
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="Enter your password"
            >
          </div>

          @if (error()) {
            <div class="alert alert-error">{{ error() }}</div>
          }

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading()">
            {{ loading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="switch-link">
          Don't have an account? <a routerLink="/signup">Create one</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
      padding: 24px;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 380px;
    }

    .auth-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #6b7280;
      font-weight: 500;
      font-size: 0.875rem;
      text-decoration: none;
    }

    .back-link svg {
      width: 18px;
      height: 18px;
    }

    .logo {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .logo-icon {
      width: 20px;
      height: 20px;
      color: #4f46e5;
    }

    h1 {
      font-size: 1.5rem;
      color: #1a1a2e;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .subtitle {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 28px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.2s;
      background: #fafafa;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #4f46e5;
      background: white;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .alert {
      padding: 10px 12px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 0.85rem;
    }

    .alert-error {
      background: #fef2f2;
      color: #dc2626;
    }

    .switch-link {
      text-align: center;
      margin-top: 24px;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .switch-link a {
      color: #4f46e5;
      font-weight: 500;
      text-decoration: none;
    }

    .switch-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  login() {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid email or password');
        this.loading.set(false);
      }
    });
  }
}
