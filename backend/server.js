import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

const PORT = process.env.PORT || 5000;

dotenv.config(); // to read variables from .env file
app.use(express.json()); //to parse the values of JSON coming from req.body
app.use(cookieParser()); //to access the jwt from cookies

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  // root route http://localhost:5000/
  res.send('hello world!!!');
});

//here server is the socket server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Listening to the server at port ${PORT}`);
});
