// const express = require('express');
// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// const router = require('./routes/TrEventRouter.js');
// app.use('/events', router);

// module.exports = app;

import express from 'express';
import trEventRouter from './routes/TrEventRouter.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',  // React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

app.use('/events', trEventRouter);

export default app;