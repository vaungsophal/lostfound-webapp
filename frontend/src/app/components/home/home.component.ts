import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ItemResponse } from '../../models/item.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app">
      <nav class="navbar">
        <div class="nav-container">
          <a routerLink="/" class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            Lost & Found
          </a>
          <div class="nav-right">
            @if (authService.isLoggedIn()) {
              <span class="welcome">Hi, {{ authService.user()?.name }}</span>
              <a routerLink="/post" class="btn btn-primary">+ Post Item</a>
              <button class="btn btn-ghost" (click)="logout()">Logout</button>
            } @else {
              <a routerLink="/login" class="btn btn-ghost">Login</a>
              <a routerLink="/signup" class="btn btn-primary">Sign Up</a>
            }
          </div>
        </div>
      </nav>

      <header class="hero">
        <div class="hero-content">
          <h1>Find What You Lost,<br>Return What You Found</h1>
          <p>Simple and easy way to reconnect with your belongings</p>
          <div class="hero-actions">
            <a routerLink="/lost" class="btn btn-lost">I Lost Something</a>
            <a routerLink="/found" class="btn btn-found">I Found Something</a>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="section-header">
          <h2>Recent Items</h2>
          <div class="tabs">
            <button [class.active]="activeTab() === 'all'" (click)="activeTab.set('all')">All</button>
            <button [class.active]="activeTab() === 'lost'" (click)="activeTab.set('lost')">Lost</button>
            <button [class.active]="activeTab() === 'found'" (click)="activeTab.set('found')">Found</button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (filteredItems().length === 0) {
          <div class="empty">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <h3>No items yet</h3>
            <p>Be the first to post a lost or found item!</p>
          </div>
        } @else {
          <div class="items-grid">
            @for (item of filteredItems(); track item.id) {
              <a [routerLink]="['/item', item.id]" class="item-card" [class.lost]="item.type === 'lost'" [class.found]="item.type === 'found'">
                <div class="item-badge" [class]="item.type">{{ item.type }}</div>
                @if (item.imageUrl) {
                  <div class="item-image">
                    <img [src]="item.imageUrl" [alt]="item.title">
                  </div>
                }
                <div class="item-content">
                  <h3>{{ item.title }}</h3>
                  <p class="item-category">{{ item.category }}</p>
                  <div class="item-meta">
                    <span class="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {{ item.location }}
                    </span>
                    <span class="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ item.date | date:'MMM d' }}
                    </span>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </main>

      <footer class="footer">
        <p>&copy; 2026 Lost & Found. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .navbar {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .logo-icon {
      width: 24px;
      height: 24px;
      color: #4f46e5;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .welcome {
      color: #6b7280;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
    }

    .btn-primary:hover {
      background: #4338ca;
    }

    .btn-ghost {
      background: transparent;
      color: #6b7280;
    }

    .btn-ghost:hover {
      background: #f3f4f6;
      color: #1a1a2e;
    }

    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
      padding: 72px 24px;
      text-align: center;
      color: white;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .hero p {
      font-size: 1.1rem;
      color: #9ca3af;
      margin-bottom: 32px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-lost {
      background: #dc2626;
      color: white;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
    }

    .btn-lost:hover {
      background: #b91c1c;
    }

    .btn-found {
      background: #059669;
      color: white;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
    }

    .btn-found:hover {
      background: #047857;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .section-header h2 {
      font-size: 1.5rem;
      color: #1a1a2e;
      font-weight: 600;
    }

    .tabs {
      display: flex;
      gap: 4px;
      background: white;
      padding: 4px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .tabs button {
      padding: 8px 20px;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-weight: 500;
      color: #6b7280;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tabs button.active {
      background: #1a1a2e;
      color: white;
    }

    .tabs button:hover:not(.active) {
      background: #f3f4f6;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .item-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: all 0.2s;
      display: block;
      text-decoration: none;
      color: inherit;
      border: 1px solid #e5e7eb;
    }

    .item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .item-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      z-index: 1;
    }

    .item-badge.lost {
      background: #fef2f2;
      color: #dc2626;
    }

    .item-badge.found {
      background: #ecfdf5;
      color: #059669;
    }

    .item-card {
      position: relative;
    }

    .item-image {
      height: 160px;
      background: #f3f4f6;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-content {
      padding: 16px;
    }

    .item-content h3 {
      font-size: 1rem;
      color: #1a1a2e;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .item-category {
      color: #4f46e5;
      font-weight: 500;
      font-size: 0.8rem;
      margin-bottom: 12px;
    }

    .item-meta {
      display: flex;
      gap: 16px;
      color: #9ca3af;
      font-size: 0.8rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .meta-item svg {
      width: 14px;
      height: 14px;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #4f46e5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: #d1d5db;
      margin: 0 auto 16px;
    }

    .empty h3 {
      color: #1a1a2e;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .empty p {
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .footer {
      background: #1a1a2e;
      color: white;
      text-align: center;
      padding: 24px;
      margin-top: auto;
    }

    .footer p {
      color: #9ca3af;
      font-size: 0.875rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  private router = inject(Router);
  
  items = signal<ItemResponse[]>([]);
  activeTab = signal<'all' | 'lost' | 'found'>('all');
  loading = signal(true);

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading.set(true);
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filteredItems() {
    const tab = this.activeTab();
    if (tab === 'all') return this.items();
    return this.items().filter(item => item.type === tab);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
