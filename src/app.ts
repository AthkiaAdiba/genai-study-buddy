import express from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app = express();

// Middlewares
app.use(express.json());
app.use('/api', router);

app.get('/', (_req, res) => {
  res.send('API server is running!');
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
