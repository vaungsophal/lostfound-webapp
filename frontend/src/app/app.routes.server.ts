import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'lost',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'found',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'post',
    renderMode: RenderMode.Client
  },
  {
    path: 'item/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
