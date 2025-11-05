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
  ],
};
