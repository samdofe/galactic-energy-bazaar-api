import http from 'http';
import { Server } from 'socket.io';

export const generateSocketIO = (httpServer: http.Server )=>{
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    });

    // WebSocket connection
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Handle client disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}