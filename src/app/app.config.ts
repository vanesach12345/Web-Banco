import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { withEnabledBlockingInitialNavigation } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';   
import { jwtInterceptor } from './interceptors/jwt.interceptor';  // Importar el interceptor funcional

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),  // Usar el interceptor funcional

    provideRouter(routes),
    provideRouter(routes, withEnabledBlockingInitialNavigation()), 
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),                          
      withInterceptors([jwtInterceptor])   // Usar el interceptor funcional también aquí
    ),
    provideZonelessChangeDetection(),
  ],
};
