import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { RequestArrayService } from './services/request-array.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server

  },
  {
    path: ':title',
    renderMode: RenderMode.Server
  }
];
