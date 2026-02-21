import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ItemResponse } from '../../models/item.model';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <header class="page-header">
        <a routerLink="/" class="back-btn">← Back</a>
        <h1>Post an Item</h1>
      </header>

      <div class="form-container">
        <div class="type-selector">
          <button 
            [class.active]="itemType() === 'lost'" 
            (click)="itemType.set('lost')"
            class="type-btn lost"
          >I Lost Something</button>
          <button 
            [class.active]="itemType() === 'found'" 
            (click)="itemType.set('found')"
            class="type-btn found"
          >I Found Something</button>
        </div>

        <form (ngSubmit)="submitItem()">
          <div class="form-group">
            <label>Title *</label>
            <input 
              type="text" 
              [(ngModel)]="form.title" 
              name="title" 
              required
              placeholder="e.g., Blue Backpack with stickers"
            >
          </div>

          <div class="form-group">
            <label>Category *</label>
            <select [(ngModel)]="form.category" name="category" required>
              <option value="">Select a category</option>
              @for (cat of categories; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea 
              [(ngModel)]="form.description" 
              name="description" 
              required
              rows="4"
              placeholder="Describe the item in detail..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Location *</label>
            <input 
              type="text" 
              [(ngModel)]="form.location" 
              name="location" 
              required
              placeholder="e.g., Library, 2nd Floor"
            >
          </div>

          <div class="form-group">
            <label>Date *</label>
            <input 
              type="date" 
              [(ngModel)]="form.date" 
              name="date" 
              required
            >
          </div>

          <div class="form-group">
            <label>Image URL (optional)</label>
            <input 
              type="url" 
              [(ngModel)]="form.imageUrl" 
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
            >
          </div>

          <h3>Contact Information</h3>

          <div class="form-group">
            <label>Your Name *</label>
            <input 
              type="text" 
              [(ngModel)]="form.contactName" 
              name="contactName" 
              required
            >
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              [(ngModel)]="form.contactPhone" 
              name="contactPhone"
            >
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              [(ngModel)]="form.contactEmail" 
              name="contactEmail" 
              required
            >
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          @if (success()) {
            <div class="success-message">{{ success() }}</div>
          }

          <button type="submit" class="submit-btn" [disabled]="submitting()">
            {{ submitting() ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f5f5f5;
      padding-bottom: 40px;
    }
    .page-header {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
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
    .form-container {
      max-width: 600px;
      margin: 30px auto;
      padding: 0 20px;
    }
    .type-selector {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
    }
    .type-btn {
      flex: 1;
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 12px;
      background: white;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .type-btn.lost.active {
      border-color: #e74c3c;
      background: #e74c3c;
      color: white;
    }
    .type-btn.found.active {
      border-color: #27ae60;
      background: #27ae60;
      color: white;
    }
    form {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    form h3 {
      margin: 25px 0 15px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    .submit-btn {
      width: 100%;
      padding: 15px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
    }
    .submit-btn:hover:not(:disabled) {
      background: #5a6fd6;
    }
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error-message {
      padding: 12px;
      background: #fee;
      color: #c00;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .success-message {
      padding: 12px;
      background: #efe;
      color: #060;
      border-radius: 8px;
      margin-bottom: 15px;
    }
  `]
})
export class PostItemComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  itemType = signal<'lost' | 'found'>('lost');
  submitting = signal(false);
  error = signal('');
  success = signal('');

  categories = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Sports', 'Keys', 'Wallet', 'Other'];

  form = {
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    imageUrl: ''
  };

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const user = this.authService.user();
    if (user) {
      this.form.contactName = user.name;
      this.form.contactEmail = user.email;
    }
  }

  submitItem() {
    if (!this.form.title || !this.form.category || !this.form.description || 
        !this.form.location || !this.form.date || !this.form.contactName || 
        !this.form.contactEmail) {
      this.error.set('Please fill in all required fields');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const item: ItemResponse = {
      title: this.form.title,
      description: this.form.description,
      category: this.form.category,
      location: this.form.location,
      date: this.form.date,
      type: this.itemType(),
      contactName: this.form.contactName,
      contactPhone: this.form.contactPhone,
      contactEmail: this.form.contactEmail,
      imageUrl: this.form.imageUrl || undefined,
      status: 'open',
      userId: this.authService.user()?.id || ''
    };

    this.apiService.createItem(item).subscribe({
      next: () => {
        this.success.set('Item posted successfully!');
        this.submitting.set(false);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: () => {
        this.error.set('Failed to post item. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
