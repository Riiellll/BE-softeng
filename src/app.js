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

const app = express();
app.use(express.json());

app.use('/events', trEventRouter);

export default app;