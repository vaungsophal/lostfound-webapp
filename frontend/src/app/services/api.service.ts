import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemResponse } from '../models/item.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:5000/api';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllItems(): Observable<ItemResponse[]> {
    return this.http.get<ItemResponse[]>(`${this.apiUrl}/items`);
  }

  getItemsByType(type: 'lost' | 'found'): Observable<ItemResponse[]> {
    return this.http.get<ItemResponse[]>(`${this.apiUrl}/items/type/${type}`);
  }

  getItemById(id: string): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(`${this.apiUrl}/items/${id}`);
  }

  createItem(item: ItemResponse): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiUrl}/items`, item, {
      headers: this.getAuthHeaders()
    });
  }

  updateItem(id: string, item: ItemResponse): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(`${this.apiUrl}/items/${id}`, item, {
      headers: this.getAuthHeaders()
    });
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
