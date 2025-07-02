import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Buy } from '../interfaces/buy-interfaces';

@Injectable({
  providedIn: 'root'
})
export class BuyService {
  private apiUrl = 'http://localhost:8085/v1/api/buys';

  constructor(private http: HttpClient) {}

  getBuys(): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiUrl);
  }

  getBuyById(id: number): Observable<Buy> {
    return this.http.get<Buy>(`${this.apiUrl}/${id}`);
  }

  saveBuy(buy: Buy): Observable<Buy> {
    return this.http.post<Buy>(`${this.apiUrl}/save`, buy);
  }

  updateBuy(id: number, buy: Buy): Observable<Buy> {
    return this.http.put<Buy>(`${this.apiUrl}/update/${id}`, buy);
  }

  deleteBuy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
