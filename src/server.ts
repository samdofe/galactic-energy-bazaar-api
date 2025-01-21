import express, { Request, Response } from 'express';
import http from 'http';
import config from './helpers/config.helper';
import allRoutes from './routes/index';
import {generateSocketIO} from "./socketio";
import {connectDB} from "./config/db";

connectDB();

const {port: PORT} = config;
const app = express();

app.use(express.json());

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