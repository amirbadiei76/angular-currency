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
    renderMode: RenderMode.Server
  },
  {
    path: 'gold-calculator',
    renderMode: RenderMode.Server
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: ':title',
    fallback: PrerenderFallback.Server,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const service = inject(RequestArrayService);
      return service.allItemsList.map((item) => ({
        title: item.slugText!
      }))
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
