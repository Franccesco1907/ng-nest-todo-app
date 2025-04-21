import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";
import { routes } from "./app.routes";
import { authExpiredInterceptorFn, authInterceptorFn, responseHandlerInterceptorFn } from "./core/interceptors";
import { MaterialStandaloneModules } from "./shared/ui";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule, MaterialStandaloneModules),
    provideHttpClient(
      withInterceptors([
        responseHandlerInterceptorFn,
        authInterceptorFn,
        authExpiredInterceptorFn,
      ])
    )
  ]
};
