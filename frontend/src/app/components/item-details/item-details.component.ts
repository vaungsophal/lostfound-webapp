import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ItemResponse } from '../../models/item.model';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      @if (loading()) {
        <div class="loading">Loading...</div>
      } @else if (!item()) {
        <div class="not-found">
          <p>Item not found</p>
          <a routerLink="/" class="btn">Back to Home</a>
        </div>
      } @else {
        <header class="page-header" [class.lost]="item()!.type === 'lost'" [class.found]="item()!.type === 'found'">
          <a routerLink="/" class="back-btn">← Back</a>
          <h1>{{ item()!.type === 'lost' ? 'Lost Item' : 'Found Item' }}</h1>
          <span class="status-badge" [class]="item()!.status">{{ item()!.status }}</span>
        </header>

        <div class="content">
          @if (item()!.imageUrl) {
            <div class="image-container">
              <img [src]="item()!.imageUrl" [alt]="item()!.title" />
            </div>
          }

          <div class="details-card">
            <h2>{{ item()!.title }}</h2>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Category</span>
                <span class="value">{{ item()!.category }}</span>
              </div>
              <div class="info-item">
                <span class="label">Location</span>
                <span class="value">{{ item()!.location }}</span>
              </div>
              <div class="info-item">
                <span class="label">Date</span>
                <span class="value">{{ item()!.date | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Posted</span>
                <span class="value">{{ item()!.createdAt | date:'medium' }}</span>
              </div>
            </div>

            <div class="description">
              <h3>Description</h3>
              <p>{{ item()!.description }}</p>
            </div>

            <div class="contact-section">
              <h3>Contact Information</h3>
              <div class="contact-card">
                <p><strong>Name:</strong> {{ item()!.contactName }}</p>
                @if (item()!.contactPhone) {
                  <p><strong>Phone:</strong> {{ item()!.contactPhone }}</p>
                }
                <p><strong>Email:</strong> {{ item()!.contactEmail }}</p>
                @if (item()!.contactTelegram) {
                  <p><strong>Telegram:</strong> @{{ item()!.contactTelegram }}</p>
                }
              </div>
              <a [href]="'mailto:' + item()!.contactEmail + '?subject=Re: ' + item()!.title" class="contact-btn">
                Contact Owner
              </a>
            </div>
          </div>
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
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .page-header.lost {
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    }
    .page-header.found {
      background: linear-gradient(135deg, #1B3A6B 0%, #0F2340 100%);
    }
    .back-btn {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }
    .page-header h1 {
      color: white;
      margin: 0;
      flex: 1;
    }
    .status-badge {
      padding: 6px 12px;
      border-radius: 3px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-badge.open {
      background: #fff3cd;
      color: #856404;
    }
    .status-badge.claimed {
      background: #d4edda;
      color: #155724;
    }
    .status-badge.closed {
      background: #e2e3e5;
      color: #383d41;
    }
    .content {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .image-container {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .image-container img {
      width: 100%;
      max-height: 400px;
      object-fit: contain;
    }
    .details-card {
      background: white;
      border-radius: 4px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .details-card h2 {
      margin: 0 0 20px;
      color: #333;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-item .label {
      font-size: 0.85rem;
      color: #888;
      margin-bottom: 4px;
    }
    .info-item .value {
      font-weight: 500;
      color: #333;
    }
    .description {
      margin-bottom: 25px;
    }
    .description h3, .contact-section h3 {
      color: #333;
      margin: 0 0 10px;
    }
    .description p {
      color: #555;
      line-height: 1.6;
    }
    .contact-card {
      background: #e0e7f5;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 15px;
      border-left: 4px solid #1B3A6B;
    }
    .contact-card p {
      margin: 8px 0;
      color: #555;
    }
    .contact-btn {
      display: block;
      width: 100%;
      padding: 12px;
      background: #1B3A6B;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 3px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .contact-btn:hover {
      background: #0F2340;
      transform: translateY(-1px);
    }
    .loading, .not-found {
      text-align: center;
      padding: 60px 20px;
    }
    .not-found p {
      color: #666;
      margin-bottom: 20px;
    }
    .btn {
      padding: 10px 24px;
      background: #1B3A6B;
      color: white;
      text-decoration: none;
      border-radius: 3px;
      font-weight: 600;
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #0F2340;
    }
    @media (max-width: 768px) {
      .page-header {
        padding: 16px;
        flex-wrap: wrap;
        gap: 10px;
      }
      .page-header h1 {
        font-size: 1.25rem;
        flex-basis: 100%;
      }
      .content {
        padding: 16px;
      }
      .details-card {
        padding: 20px;
      }
      .info-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
  `]
})
export class ItemDetailsComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  item = signal<ItemResponse | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadItem(id);
    }
  }

  loadItem(id: string) {
    this.loading.set(true);
    this.apiService.getItemById(id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
