import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

import { HTTP_INTERCEPTORS, provideHttpClient,withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../app/auth/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
     provideHttpClient(withInterceptors([authInterceptor]))
   
  ]
};
