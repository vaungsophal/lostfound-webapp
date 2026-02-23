import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <a routerLink="/" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <a routerLink="/" class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </a>
          <span></span>
        </div>

        <h1>Create Account</h1>
        <p class="subtitle">Join to help reconnect items</p>

        <form (ngSubmit)="signup()">
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="name" 
              name="name" 
              required
              placeholder="Full Name"
            >
          </div>

          <div class="form-group">
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              required
              placeholder="Email"
            >
          </div>

          <div class="form-group">
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="Password"
            >
          </div>

          <div class="form-group">
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              required
              placeholder="Confirm Password"
            >
          </div>

          @if (error()) {
            <div class="alert alert-error">{{ error() }}</div>
          }

          @if (success()) {
            <div class="alert alert-success">{{ success() }}</div>
          }

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading()">
            {{ loading() ? 'Creating...' : 'Create Account' }}
          </button>
        </form>

        <p class="switch-link">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      background: linear-gradient(135deg, #1B3A6B 0%, #0F2340 100%);
      padding: 20px;
    }

    .auth-card {
      background: var(--white);
      padding: 32px 28px;
      border-radius: 6px;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 380px;
    }

    .auth-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      gap: 16px;
    }

    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 3px;
      color: var(--gray-500);
      background: var(--gray-100);
      text-decoration: none;
      transition: var(--transition);
    }

    .back-link:hover {
      background: var(--gray-200);
      color: var(--dark);
    }

    .back-link svg {
      width: 18px;
      height: 18px;
    }

    .logo {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: center;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      color: #1B3A6B;
    }

    h1 {
      font-size: 1.5rem;
      color: var(--dark);
      margin-bottom: 6px;
      font-weight: 700;
    }

    .subtitle {
      color: var(--gray-500);
      font-size: 0.9rem;
      margin-bottom: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group input {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid var(--gray-300);
      border-radius: 3px;
      font-size: 0.9rem;
      transition: var(--transition);
      background: var(--gray-50);
    }

    .form-group input::placeholder {
      color: var(--gray-400);
    }

    .form-group input:focus {
      outline: none;
      border-color: #1B3A6B;
      background: var(--white);
      box-shadow: 0 0 0 3px rgba(27, 58, 107, 0.1);
    }

    .alert {
      padding: 12px 14px;
      border-radius: 3px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      border-left: 4px solid;
    }

    .alert-error {
      background: #fee2e2;
      color: #991b1b;
      border-left-color: #DC2626;
    }

    .alert-success {
      background: #e0e7f5;
      color: #1B3A6B;
      border-left-color: #1B3A6B;
    }

    .btn {
      padding: 11px 16px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      margin-bottom: 16px;
    }

    .btn-primary {
      background: #1B3A6B;
      color: var(--white);
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0F2340;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .switch-link {
      text-align: center;
      color: var(--gray-600);
      font-size: 0.9rem;
    }

    .switch-link a {
      color: #1B3A6B;
      font-weight: 600;
      text-decoration: none;
    }

    .switch-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 24px 20px;
        border-radius: 4px;
      }

      h1 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  signup() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.email, this.password, this.name).subscribe({
      next: () => {
        this.success.set('Account created successfully!');
        this.loading.set(false);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed. Email may already be in use.');
        this.loading.set(false);
      }
    });
  }
}
