import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from '../interfaces/purchase-detail-interfaces';

@Injectable({
  providedIn: 'root'
})
export class PurchaseDetailService {
  private apiUrl = 'http://localhost:8085/v1/api/purchase-details';

  constructor(private http: HttpClient) {}

  getDetailsByBuyId(buyId: number): Observable<PurchaseDetail[]> {
    return this.http.get<PurchaseDetail[]>(`${this.apiUrl}/buy/${buyId}`);
  }

  getAllDetails(): Observable<PurchaseDetail[]> {
    return this.http.get<PurchaseDetail[]>(this.apiUrl);
  }

  getDetailById(id: number): Observable<PurchaseDetail> {
    return this.http.get<PurchaseDetail>(`${this.apiUrl}/${id}`);
  }

  saveDetail(detail: PurchaseDetail): Observable<PurchaseDetail> {
    return this.http.post<PurchaseDetail>(`${this.apiUrl}/save`, detail);
  }

  updateDetail(id: number, detail: PurchaseDetail): Observable<PurchaseDetail> {
    return this.http.put<PurchaseDetail>(`${this.apiUrl}/update/${id}`, detail);
  }

  deleteDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
