import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const UsernamePrompt = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (username.trim()) {
            socket.emit('setUsername', username); // Emit username to the backend
            localStorage.setItem('username', username); // Store the username in localStorage
            navigate('/contacts'); // Navigate to the contact list page
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex justify-center items-center">
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="mb-4 text-xl">Enter your username</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 rounded bg-gray-700 text-white"
                />
                <button onClick={handleSubmit} className="mt-4 bg-blue-600 p-2 rounded">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default UsernamePrompt;