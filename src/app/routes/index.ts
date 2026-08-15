import { Router } from 'express';
import { StudyRoutes } from '../modules/study/study.route';
import { ChatRoutes } from '../modules/chat/chat.route';

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
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
