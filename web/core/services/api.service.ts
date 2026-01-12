/*
Objectif :
Service générique encapsulant les appels HTTP vers l’API Gateway afin de centraliser l’accès aux endpoints backend et garantir un point d’entrée unique.
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any) {
    return this.http.get<T>(`${this.baseUrl}${url}`, { params });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }
}
