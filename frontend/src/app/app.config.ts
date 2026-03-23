import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from "./app.routes";
import { authExpiredInterceptorFn, authInterceptorFn, responseHandlerInterceptorFn } from "./core/interceptors";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        responseHandlerInterceptorFn,
        authInterceptorFn,
        authExpiredInterceptorFn,
      ])
    )
  ]
};
