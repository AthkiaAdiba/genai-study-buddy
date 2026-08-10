import { Router } from 'express';
import { StudyRoutes } from '../modules/study/study.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/study',
    routes: StudyRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
