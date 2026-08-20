import { Router } from 'express';
import { StudyRoutes } from '../modules/study/study.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { SearchRoutes } from '../modules/search/search.route';
import { ChromaSearchRoutes } from '../modules/chroma-search/chroma-search.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/study',
    routes: StudyRoutes,
  },
  {
    path: '/chat',
    routes: ChatRoutes,
  },
  {
    path: '/search',
    routes: SearchRoutes,
  },
  {
  path: '/chroma-search',
  routes: ChromaSearchRoutes,
},
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
