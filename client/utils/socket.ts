import { io } from "socket.io-client";
const SOCKET_URL = process.env.SERVER_URL;
export const socket = io(SOCKET_URL, {
    withCredentials: true,
});