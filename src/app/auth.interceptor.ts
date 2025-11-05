import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  let apiKey: string | null = null;

  if (isPlatformBrowser(platformId)) {
    apiKey = localStorage.getItem('maklu-api-key');
  }

  if (!apiKey) {
    apiKey = environment.apiKey;
  }

  if (apiKey) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    return next(authReq);
  }
  return next(req);
};