// app.config.ts
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig = {
  providers: [
    // 🧭 Rutas principales
    provideRouter(routes),

    // 🌐 Cliente HTTP con interceptores (si luego usas uno)
    provideHttpClient(
      withInterceptors([]) // puedes agregar interceptores aquí si lo necesitas
    ),

    // ✅ Formularios reactivos (necesario para FormBuilder y validaciones)
    importProvidersFrom(ReactiveFormsModule)
  ]
};
