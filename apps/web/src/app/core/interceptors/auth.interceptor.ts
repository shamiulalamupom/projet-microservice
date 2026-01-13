import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { TokenStore } from "../auth/token.store";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(TokenStore);
  const token = store.getToken();
  
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
