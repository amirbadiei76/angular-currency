import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { RequestArrayService } from './services/request-array.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender

  },
  {
    path: ':title',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const requestService = inject(RequestArrayService)

      const items = requestService.allItemsList.map((item) => ({title: item.slugText!}))
      return items;
    }
  }
];
