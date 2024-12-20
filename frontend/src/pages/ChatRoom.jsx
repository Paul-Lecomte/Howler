import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hey, how are you?', time: '19:04', sender: 'self' },
        { id: 2, text: 'Have you worked on the project?', time: '19:04', sender: 'self' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage, time: '19:05', sender: 'self' }]);
            setNewMessage('');
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
                <button onClick={() => navigate('/')}>&larr;</button>
                <div className="bg-gray-700 rounded-full w-10 h-10" />
                <div>
                    <div className="font-bold">Contact Name</div>
                    <div className="text-sm text-gray-400">+41 79 269 84 75</div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 p-3 rounded-lg ${
                            message.sender === 'self' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
                        }`}
                    >
                        {message.text}
                        <div className="text-xs text-gray-400 text-right">{message.time}</div>
                    </div>
                ))}
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