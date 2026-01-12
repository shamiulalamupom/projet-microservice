/*
Objectif :
Service métier responsable de la récupération, de la recherche et de la création des trajets via l’API Gateway.
*/

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TrajetService {
  constructor(private api: ApiService) {}

  search(params: any) {
    return this.api.get('/trajets', params);
  }

  getById(id: string) {
    return this.api.get(`/trajets/${id}`);
  }

  create(data: any) {
    return this.api.post('/trajets', data);
  }
}
