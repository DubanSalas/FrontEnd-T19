import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([])
    ),

    importProvidersFrom(ReactiveFormsModule)
  ]
};
