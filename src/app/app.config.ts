<<<<<<< HEAD
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // ✅ Importar FormsModule
import { jwtInterceptor } from './interceptors/jwt.interceptor';  // tu interceptor funcional

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Activar HttpClient con interceptores y Fetch
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),

    // ✅ Activar enrutador con navegación inicial bloqueante
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    // ✅ Habilitar formularios (para [(ngModel)])
    importProvidersFrom(FormsModule),

    // ✅ Otros providers útiles
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
=======
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
>>>>>>> bdbd8f43011b87f0121304e3b1d8def50cccafdc
  ],
};
