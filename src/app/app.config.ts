import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth';
import { errorInterceptor } from './core/interceptors/error';
import { loadingInterceptor } from './core/interceptors/loading';
import { AuthStore } from './core/store/auth'; 

// Inicializa Keycloak antes de que arranque la app
function initKeycloak(authStore: AuthStore) {
  return () => authStore.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [AuthStore],
      multi: true
    }
  ]
};