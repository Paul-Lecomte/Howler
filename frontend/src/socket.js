import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

export default socket;
