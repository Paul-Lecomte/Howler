import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const UsernamePrompt = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (username.trim()) {
            socket.emit('setUsername', username);
            localStorage.setItem('username', username);
            navigate('/contacts');
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex justify-center items-center">
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="mb-4 text-xl font-bold">Choose Your Username</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 py-2 rounded text-white font-semibold"
                >
                    Start Chatting
                </button>
            </div>
        </div>
    );
};

export default UsernamePrompt;