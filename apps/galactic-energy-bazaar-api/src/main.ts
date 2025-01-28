/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import * as path from 'path';
import http from 'http';
import cors from 'cors';
import config from './helpers/config.helper';
import allRoutes from './routes/index';
import {generateSocketIO} from "./socketio";
import "./config/cloudinary";
import {connectDB} from "./config/db";

connectDB();

const {port: PORT} = config;
const allowOrigins = process.env.ALLOWED_ORIGINS.split(',');
/*  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'http://localhost:4203',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083'
  ];*/
const corsOptions = {
  origin: allowOrigins, // Allow requests only from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies, if your application uses them
};
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/api', allRoutes);

const httpServer = http.createServer(app);
const io = generateSocketIO(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };
