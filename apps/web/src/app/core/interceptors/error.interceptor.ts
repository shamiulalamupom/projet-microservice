import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { ToastService } from "../ui/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const payload = err.error?.error;
        if (payload?.message) {
          console.error(`[API ERROR] ${payload.code}: ${payload.message}`, payload.details);
          toast.error(payload.message);
        } else {
          console.error(`[HTTP ERROR] ${err.status} ${err.message}`);
          toast.error(`Error ${err.status}: ${err.statusText || err.message}`);
        }
      }
      return throwError(() => err);
    })
  );
};
