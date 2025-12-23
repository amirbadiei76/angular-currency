import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { RequestArrayService } from './services/request-array.service';
import { ActivatedRoute } from '@angular/router';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':title',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
