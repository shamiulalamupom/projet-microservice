/*
Objectif :
Intercepteur HTTP global permettant de centraliser la gestion des erreurs HTTP et d’afficher des messages explicites à l’utilisateur en cas d’erreur serveur ou métier.
*/

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        alert(error.error?.message || 'Erreur serveur');
        return throwError(() => error);
      })
    );
  }
}
