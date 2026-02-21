import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ItemResponse } from '../../models/item.model';

@Component({
  selector: 'app-lost-items',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <header class="page-header">
        <a routerLink="/" class="back-btn">← Back</a>
        <h1>Lost Items</h1>
      </header>

      <div class="filters">
        <select [(ngModel)]="selectedCategory" (change)="filterItems()">
          <option value="">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else if (items().length === 0) {
        <div class="no-items">
          <p>No lost items found</p>
          <a routerLink="/post" class="btn">Report a Lost Item</a>
        </div>
      } @else {
        <div class="items-grid">
          @for (item of items(); track item.id) {
            <div class="item-card lost">
              <div class="item-type-badge">LOST</div>
              <h3>{{ item.title }}</h3>
              <p class="item-category">{{ item.category }}</p>
              <p class="item-location">📍 {{ item.location }}</p>
              <p class="item-date">📅 {{ item.date | date:'mediumDate' }}</p>
              <p class="item-description">{{ item.description | slice:0:100 }}...</p>
              <a [routerLink]="['/item', item.id]" class="view-btn">View Details</a>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f5f5f5;
      padding-bottom: 40px;
    }
    .page-header {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .back-btn {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }
    .page-header h1 {
      color: white;
      margin: 0;
    }
    .filters {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .filters select {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .item-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
    }
    .item-type-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
      background: #e74c3c;
    }
    .item-card h3 {
      margin: 0 0 10px;
      color: #333;
    }
    .item-category {
      color: #666;
      font-weight: 500;
    }
    .item-location, .item-date {
      color: #888;
      margin: 5px 0;
    }
    .item-description {
      color: #555;
      margin: 10px 0;
    }
    .view-btn {
      display: inline-block;
      margin-top: 10px;
      padding: 8px 20px;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 20px;
    }
    .loading, .no-items {
      text-align: center;
      padding: 60px 20px;
    }
    .no-items p {
      color: #666;
      margin-bottom: 20px;
    }
    .btn {
      padding: 12px 28px;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 600;
    }
  `]
})
export class LostItemsComponent implements OnInit {
  private apiService = inject(ApiService);
  
  items = signal<ItemResponse[]>([]);
  loading = signal(true);
  selectedCategory = '';
  
  categories = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Sports', 'Keys', 'Wallet', 'Other'];

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading.set(true);
    this.apiService.getItemsByType('lost').subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filterItems() {
    if (!this.selectedCategory) {
      this.loadItems();
    } else {
      const filtered = this.items().filter(item => item.category === this.selectedCategory);
      this.items.set(filtered);
    }
  }
}
