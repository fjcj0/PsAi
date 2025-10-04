"use client";
import React, { useEffect, useState } from "react";
import { socket } from '../../utils/socket';
const page = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    useEffect(() => {
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => {
            socket.off("receiveMessage");
        };
    }, []);
    const sendMessage = () => {
        if (input.trim() === "") return;
        socket.emit("sendMessage", input);
        setInput("");
    };
    return (
        <div>
            <h2>Chat</h2>
            <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "scroll" }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
export default page;