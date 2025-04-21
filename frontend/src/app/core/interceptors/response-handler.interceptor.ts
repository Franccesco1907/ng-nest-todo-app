import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

interface ApiResponse<T> {
  status: number;
  data: T;
  errors: string[];
}

export const responseHandlerInterceptorFn: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse<any>;
        if (body?.status >= 200 && body.status < 300) {
          return event.clone({ body: body.data });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error in the server response:', error);
      return throwError(() => error);
    })
  );
};