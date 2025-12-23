import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { RequestArrayService } from './services/request-array.service';
import { ActivatedRoute } from '@angular/router';

export const serverRoutes: ServerRoute[] = [
  // {
  //   path: ':title',
  //   renderMode: RenderMode.Server
  // },
  // {
  //   path: '**',
  //   renderMode: RenderMode.Prerender,

  // }
  {
    path: 'converter',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'gold-calculator',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: ':title',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
