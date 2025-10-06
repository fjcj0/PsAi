import { io } from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const socket = io(SOCKET_URL, {
    withCredentials: true,
});