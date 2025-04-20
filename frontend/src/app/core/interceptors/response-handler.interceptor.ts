import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

interface ApiResponse<T> {
  status: number;
  data: T;
  errors: string[];
}

@Injectable()
export class ResponseHandlerInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          const response = event as HttpResponse<ApiResponse<any>>;
          if (response.body && response.body.status >= 200 && response.body.status < 300) {
            return new HttpResponse({
              url: response.url ?? undefined,
              status: response.status,
              headers: response.headers,
              body: response.body.data
            });
          }
        }
        return event;
      },
        catchError((error: HttpErrorResponse) => {
          console.error('Error in the server response:', error);
          return throwError(() => error);
        })
      )
    );
  }
}