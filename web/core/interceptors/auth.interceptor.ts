/* 
Objectif :
Intercepteur HTTP chargé d’ajouter automatiquement le jeton d’authentification JWT aux requêtes sortantes afin de sécuriser les appels vers l’API Gateway.
*/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
