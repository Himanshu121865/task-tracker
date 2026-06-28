import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/tasks.js';

export default function createApp(...middleware) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  if (middleware.length > 0) {
    app.use(middleware[0]);
  }

  app.get('/', (req, res) => {
    res.json({ message: 'Task Tracker API is running' });
  });

  app.use('/api/tasks', taskRoutes);

  return app;
}
