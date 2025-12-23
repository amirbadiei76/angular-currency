import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
  {
    path: ':title',
    renderMode: RenderMode.Server
  },
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
    path: '**',
    renderMode: RenderMode.Client,
  }
];
