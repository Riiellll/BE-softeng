import express from 'express';
import trEventRouter from './routes/TrEventRouter.js';
import trNotificationRouter from './routes/TrNotificationRouter.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',  // React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

app.use('/events', trEventRouter);
app.use('/notifications', trNotificationRouter);

export default app;