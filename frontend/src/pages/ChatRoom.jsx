import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket'; // Assume socket is initialized

const ChatRoom = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // To scroll to the latest message

    useEffect(() => {
        // Retrieve stored messages for the current chat room
        const storedMessages = JSON.parse(localStorage.getItem(username)) || [];
        setMessages(storedMessages);

        socket.on('message', (msg) => {
            setMessages((prevMessages) => {
                const updatedMessages = [
                    ...prevMessages,
                    { id: prevMessages.length + 1, text: msg.text, sender: msg.sender, timestamp: msg.timestamp },
                ];
                // Store updated messages in localStorage
                localStorage.setItem(username, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
        });

        return () => {
            socket.off('message');
        };
    }, [username]);

    useEffect(() => {
        // Scroll to the latest message when it is added
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            const messageData = {
                text: newMessage,
                sender: username,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('message', messageData); // Send message data including sender and timestamp
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, { ...messageData, id: prevMessages.length + 1 }];
                // Store updated messages in localStorage
                localStorage.setItem(username, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            setNewMessage('');
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
                <button onClick={() => navigate('/contacts')}>&larr;</button>
                <div className="bg-gray-700 rounded-full w-10 h-10" />
                <div>
                    <div className="font-bold">{username}</div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 p-3 rounded-lg flex justify-${message.sender === username ? 'end' : 'start'}`}
                    >
                        <div className={`p-2 rounded-lg ${message.sender === username ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <div>{message.text}</div>
                            <div className="text-xs text-gray-400 text-right">{message.timestamp}</div>
                        </div>
                    </div>
                ))}
                {/* Ref to scroll to the latest message */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write something"
                    className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-300"
                />
                <button onClick={handleSend} className="ml-2 bg-blue-600 p-2 rounded-lg">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;