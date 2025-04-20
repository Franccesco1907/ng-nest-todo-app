import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { routes } from "./app.routes";
import { ResponseHandlerInterceptor } from "./core/interceptors";
import { MaterialStandaloneModules } from "./shared/ui";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom(HttpClientModule, MaterialStandaloneModules),
        { provide: HTTP_INTERCEPTORS, useClass: ResponseHandlerInterceptor, multi: true },
    ]
};
