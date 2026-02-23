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
            <img src="https://www.aupp.edu.kh/wp-content/uploads/Logo.png" alt="Logo" class="logo-img">
          </a>
          
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            @if (mobileMenuOpen()) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            }
          </button>

          <div class="nav-right" [class.mobile-open]="mobileMenuOpen()">
            @if (authService.isLoggedIn()) {
              <span class="welcome">Hi, {{ authService.user()?.name }}</span>
              <a routerLink="/post" class="btn btn-primary" (click)="closeMobileMenu()">+ Post</a>
              <button class="btn btn-ghost" (click)="logout()">Logout</button>
            } @else {
              <a routerLink="/login" class="btn btn-ghost" (click)="closeMobileMenu()">Login</a>
              <a routerLink="/signup" class="btn btn-primary" (click)="closeMobileMenu()">Sign Up</a>
            }
          </div>
        </div>
      </nav>

      <header class="hero">
        <div class="hero-content">
          @if (authService.isLoggedIn()) {
            <h1>Find What You Lost,<br>Return What You Found</h1>
            <div class="hero-actions">
              <a routerLink="/lost" class="btn btn-lost">Lost</a>
              <a routerLink="/found" class="btn btn-found">Found</a>
            </div>
          } @else {
            <h1>Let Explore</h1>
            <p class="hero-subtitle">Discover lost and found items in your area</p>
            <div class="hero-actions">
              <a routerLink="/login" class="btn btn-found">Login</a>
              <a routerLink="/signup" class="btn btn-lost">Sign Up</a>
            </div>
          }
        </div>
      </header>

      <main class="main-content">
        <div class="section-header">
          <h2>Recent</h2>
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
      background: var(--gray-50);
    }

    /* Navbar */
    .navbar {
      background: var(--white);
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--gray-200);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 14px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--primary);
      letter-spacing: -0.5px;
    }

    .logo-img {
      height: 40px;
      width: auto;
      object-fit: contain;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      color: var(--primary);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--dark);
      border-radius: var(--radius);
      transition: var(--transition);
    }

    .mobile-menu-btn:hover {
      background: var(--gray-100);
    }

    .mobile-menu-btn svg {
      width: 24px;
      height: 24px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .welcome {
      color: var(--gray-600);
      font-weight: 500;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 12px 20px;
      }

      .mobile-menu-btn {
        display: block;
      }

      .nav-right {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--white);
        flex-direction: column;
        padding: 20px;
        gap: 12px;
        border-top: 1px solid var(--gray-200);
        box-shadow: var(--shadow);
      }

      .nav-right.mobile-open {
        display: flex;
      }

      .welcome {
        text-align: center;
        font-size: 0.9rem;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #1B3A6B 0%, #0F2340 100%);
      background-image: url('https://www.aupp.edu.kh/wp-content/uploads/Scholarships-1536x640.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      padding: 120px 40px;
      text-align: center;
      color: var(--white);
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.35);
      z-index: 0;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 32px;
      line-height: 1.2;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      font-weight: 400;
      margin-bottom: 40px;
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-lost, .btn-found {
      padding: 12px 28px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: var(--transition);
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .btn-lost {
      background: var(--secondary);
      color: var(--white);
    }

    .btn-lost:hover {
      background: #B91C1C;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-found {
      background: var(--primary);
      color: var(--white);
    }

    .btn-found:hover {
      background: #0F2340;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .hero {
        padding: 60px 20px;
        background-attachment: scroll;
      }

      .hero h1 {
        font-size: 1.75rem;
        margin-bottom: 20px;
      }

      .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 24px;
      }

      .btn-lost, .btn-found {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .hero {
        padding: 100px 30px;
      }

      .hero h1 {
        font-size: 2.2rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }
    }

    /* Main Content */
    .main-content {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 40px;
      width: 100%;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      gap: 24px;
      flex-wrap: wrap;
    }

    .section-header h2 {
      font-size: 1.875rem;
      color: var(--dark);
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .tabs {
      display: flex;
      gap: 2px;
      background: var(--white);
      padding: 4px;
      border-radius: var(--radius);
      border: 1px solid var(--gray-200);
      box-shadow: var(--shadow);
    }

    .tabs button {
      padding: 8px 16px;
      border: none;
      background: transparent;
      border-radius: 3px;
      font-weight: 600;
      color: var(--gray-600);
      font-size: 0.9rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .tabs button:hover {
      background: var(--gray-100);
      color: var(--dark);
    }

    .tabs button.active {
      background: var(--primary);
      color: var(--white);
      box-shadow: var(--shadow-md);
    }

    /* Items Grid */
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }

    .item-card {
      background: var(--white);
      border-radius: 4px;
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: var(--transition);
      display: block;
      text-decoration: none;
      color: inherit;
      border: 1px solid var(--gray-100);
      position: relative;
    }

    .item-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--gray-200);
    }

    .item-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 10px;
      border-radius: 2px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      z-index: 1;
    }

    .item-badge.lost {
      background: rgba(220, 38, 38, 0.2);
      color: #b91c1c;
    }

    .item-badge.found {
      background: rgba(22, 163, 74, 0.2);
      color: #15803d;
    }

    .item-image {
      height: 180px;
      background: linear-gradient(135deg, var(--gray-200) 0%, var(--gray-300) 100%);
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-content {
      padding: 20px;
    }

    .item-content h3 {
      font-size: 1.1rem;
      color: var(--dark);
      margin-bottom: 8px;
      font-weight: 700;
      line-height: 1.4;
    }

    .item-category {
      color: var(--primary);
      font-weight: 700;
      font-size: 0.8rem;
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .item-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--gray-600);
      font-size: 0.9rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meta-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--primary);
    }

    @media (max-width: 1024px) {
      .items-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 24px;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 40px 20px;
      }

      .section-header {
        margin-bottom: 32px;
        gap: 16px;
      }

      .section-header h2 {
        font-size: 1.5rem;
      }

      .items-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .item-image {
        height: 220px;
      }

      .item-content {
        padding: 16px;
      }
    }

    /* Loading & Empty */
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 100px 20px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--gray-200);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty {
      text-align: center;
      padding: 80px 40px;
      background: var(--white);
      border-radius: 12px;
      border: 1px solid var(--gray-200);
      margin: 40px 0;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      color: var(--gray-300);
      margin: 0 auto 24px;
    }

    .empty h3 {
      color: var(--dark);
      margin-bottom: 12px;
      font-weight: 700;
      font-size: 1.3rem;
    }

    .empty p {
      color: var(--gray-600);
      font-size: 1rem;
    }

    /* Footer */
    .footer {
      background: var(--dark);
      color: var(--gray-500);
      text-align: center;
      padding: 32px 40px;
      margin-top: auto;
      border-top: 1px solid var(--gray-300);
      font-size: 0.95rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 24px 20px;
        font-size: 0.9rem;
      }
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
  mobileMenuOpen = signal(false);

  ngOnInit() {
    this.loadItems();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
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
