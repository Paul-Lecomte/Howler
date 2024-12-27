import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
            navigate('/username');
        } else {
            setUsername(storedUsername);
            socket.emit('setUsername', storedUsername);
        }

        const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
        if (storedContacts.length > 0) {
            setContacts(storedContacts);
            setFilteredContacts(storedContacts);
        }

        socket.on('users', (userList) => {
            const filteredContacts = userList.filter(user => user !== storedUsername);
            setContacts(filteredContacts);
            setFilteredContacts(filteredContacts);
            localStorage.setItem('contacts', JSON.stringify(filteredContacts));
        });

        return () => {
            socket.off('users');
        };
    }, [navigate]);

    useEffect(() => {
        const results = contacts.filter(contact =>
            contact.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(results);
    }, [searchQuery, contacts]);

    const handleContactClick = (contact) => {
        navigate(`/chat/${contact}`);
    };

    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-4" />
                <div className="text-lg font-bold">{username}</div>
            </div>

            {/* Search Input */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search a chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 rounded-full bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                        <div
                            key={index}
                            className="p-4 flex items-center hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleContactClick(contact)}
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-700 mr-4" />
                            <div className="text-sm font-medium">{contact}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 p-4">No contacts available</div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 text-center text-gray-500">
                <button
                    onClick={() => navigate('/settings')}
                    className="text-sm font-medium hover:text-white"
                >
                    Settings
                </button>
            </div>
        </div>
    );
};

export default ContactList;