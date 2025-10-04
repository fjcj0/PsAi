import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:5205";
export const socket = io(SOCKET_URL, {
    withCredentials: true,
});