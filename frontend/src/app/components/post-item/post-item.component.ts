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
      <nav class="navbar">
        <div class="nav-container">
          <a routerLink="/" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <span class="page-title">Post Item</span>
          <span></span>
        </div>
      </nav>

      <div class="form-container">
        <div class="type-selector">
          <button 
            [class.active]="itemType() === 'lost'" 
            (click)="itemType.set('lost')"
            class="type-btn lost"
          >
            Lost
          </button>
          <button 
            [class.active]="itemType() === 'found'" 
            (click)="itemType.set('found')"
            class="type-btn found"
          >
            Found
          </button>
        </div>

        <form (ngSubmit)="submitItem()">
          <div class="form-group">
            <textarea 
              [(ngModel)]="form.description" 
              name="description" 
              rows="3"
              placeholder="Describe the item..."
            ></textarea>
          </div>

          <div class="form-group">
            <input 
              type="date" 
              [(ngModel)]="form.date" 
              name="date"
            >
          </div>

          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="form.contactTelegram" 
              name="contactTelegram"
              placeholder="Telegram username (optional)"
            >
          </div>

          <div class="form-group">
            <div class="image-upload">
              @if (form.imageUrl) {
                <div class="image-preview">
                  <img [src]="form.imageUrl" alt="Preview">
                  <button type="button" class="remove-btn" (click)="removeImage()">Remove</button>
                </div>
              } @else {
                <div class="upload-area" (click)="fileInput.click()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Click to upload or paste image URL</span>
                </div>
              }
              <input 
                #fileInput
                type="file" 
                accept="image/*"
                (change)="onImageSelected($event)"
                style="display: none"
              >
              <div class="url-input-wrapper">
                <input 
                  type="text"
                  [(ngModel)]="imageUrlInput" 
                  name="imageUrl"
                  placeholder="Or paste image URL"
                  (keydown.enter)="loadImageFromUrl()"
                  class="url-input"
                >
                <button type="button" (click)="loadImageFromUrl()" class="paste-btn">Load</button>
              </div>
            </div>
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          @if (success()) {
            <div class="success-message">{{ success() }}</div>
          }

          <button type="submit" class="submit-btn" [disabled]="submitting()">
            {{ submitting() ? 'Posting...' : 'Post Item' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .navbar {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .nav-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 3px;
      color: #6b7280;
      background: #f3f4f6;
      text-decoration: none;
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    .page-title {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 0.95rem;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px 16px;
    }

    .type-selector {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    .type-btn {
      flex: 1;
      padding: 10px;
      border: 2px solid #e5e7eb;
      border-radius: 3px;
      background: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
    }

    .type-btn.lost.active {
      border-color: #DC2626;
      background: #fee2e2;
      color: #DC2626;
    }

    .type-btn.found.active {
      border-color: #1B3A6B;
      background: #e0e7f5;
      color: #1B3A6B;
    }

    form {
      background: white;
      padding: 16px;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid #e5e7eb;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 3px;
      font-size: 0.9rem;
      box-sizing: border-box;
      font-family: inherit;
      background: #fafafa;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1B3A6B;
      background: white;
      box-shadow: 0 0 0 3px rgba(27, 58, 107, 0.1);
    }

    .image-upload {
      position: relative;
    }

    .upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-area:hover {
      border-color: #1B3A6B;
      background: #fafafa;
    }

    .upload-area svg {
      width: 28px;
      height: 28px;
      color: #9ca3af;
      margin-bottom: 6px;
    }

    .upload-area span {
      display: block;
      color: #6b7280;
      font-size: 0.8rem;
    }

    .image-preview {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .image-preview img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }

    .remove-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #DC2626;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 2px;
      font-size: 0.7rem;
      cursor: pointer;
      font-weight: 500;
    }

    .remove-btn:hover {
      background: #B91C1C;
    }

    .url-input-wrapper {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }

    .url-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-radius: 3px;
      font-size: 0.8rem;
      background: #fafafa;
    }

    .url-input:focus {
      outline: none;
      border-color: #1B3A6B;
      background: white;
      box-shadow: 0 0 0 3px rgba(27, 58, 107, 0.1);
    }

    .paste-btn {
      padding: 8px 12px;
      background: #1B3A6B;
      color: white;
      border: 1px solid #1B3A6B;
      border-radius: 3px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .paste-btn:hover {
      background: #0F2340;
    }
    .submit-btn {
      width: 100%;
      padding: 12px;
      background: #1B3A6B;
      color: white;
      border: none;
      border-radius: 3px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 4px;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0F2340;
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      padding: 10px 12px;
      background: #fee2e2;
      color: #DC2626;
      border-radius: 3px;
      margin-bottom: 10px;
      font-size: 0.8rem;
    }

    .success-message {
      padding: 10px 12px;
      background: #e0e7f5;
      color: #1B3A6B;
      border-radius: 3px;
      margin-bottom: 10px;
      font-size: 0.8rem;
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

  imageUrlInput = '';

  form = {
    description: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    contactTelegram: ''
  };

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.error.set('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error.set('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.form.imageUrl = e.target.result as string;
          this.error.set('');
        }
      };
      reader.onerror = () => {
        this.error.set('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  }

  loadImageFromUrl() {
    const url = this.imageUrlInput.trim();
    if (!url) {
      this.error.set('Please enter a valid URL');
      return;
    }

    // Simple URL validation
    try {
      new URL(url);
      this.form.imageUrl = url;
      this.imageUrlInput = '';
      this.error.set('');
    } catch {
      this.error.set('Invalid URL format');
    }
  }

  removeImage() {
    this.form.imageUrl = '';
    this.imageUrlInput = '';
  }

  submitItem() {
    if (!this.form.description) {
      this.error.set('Please enter a description');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const user = this.authService.user();

    const item: ItemResponse = {
      title: this.form.description.substring(0, 50) + (this.form.description.length > 50 ? '...' : ''),
      description: this.form.description,
      category: 'Other',
      location: 'Not specified',
      date: this.form.date,
      type: this.itemType(),
      contactName: user?.name || '',
      contactPhone: '',
      contactEmail: user?.email || '',
      contactTelegram: this.form.contactTelegram || undefined,
      imageUrl: this.form.imageUrl || undefined,
      status: 'open',
      userId: user?.id || ''
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
