import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {  withEnabledBlockingInitialNavigation } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';   // ← IMPORTA ESTO
import { jwtInterceptor } from './interceptors/jwt.interceptor';              // ← Y ESTO

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes),
    
    provideRouter(routes, withEnabledBlockingInitialNavigation()), 
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),                          
      withInterceptors([jwtInterceptor])   
    ),
    provideZonelessChangeDetection(),
   
  ],
};
