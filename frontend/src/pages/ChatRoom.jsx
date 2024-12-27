import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import socket from '../socket';

const ChatRoom = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null); // To scroll to the latest message

    useEffect(() => {
        const storedMessages = JSON.parse(localStorage.getItem(username)) || [];
        setMessages(storedMessages);

        socket.on('message', (msg) => {
            setMessages((prevMessages) => {
                const updatedMessages = [
                    ...prevMessages,
                    { id: prevMessages.length + 1, text: msg.text, sender: msg.sender, timestamp: msg.timestamp },
                ];
                localStorage.setItem(username, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
        });

        return () => {
            socket.off('message');
        };
    }, [username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            const messageData = {
                text: newMessage,
                sender: username,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.emit('message', messageData); // Send message data
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, { ...messageData, id: prevMessages.length + 1 }];
                localStorage.setItem(username, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            setNewMessage('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setNewMessage((prev) => prev + emojiObject.emoji);
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
                <div ref={messagesEndRef} />
            </div>

            {/* Input and Emoji Picker */}
            <div className="p-4 border-t border-gray-700 flex items-center relative">
                <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="mr-2 bg-transparent"
                >
                    <img
                        src="/howler_logo.svg"
                        alt="Emoji Picker"
                        className="w-13 h-13"
                    />
                </button>
                {showEmojiPicker && (
                    <div className="absolute bottom-20 left-4 bg-gray-800 rounded-lg shadow-lg">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
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