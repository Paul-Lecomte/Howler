import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket'; // Assume socket is initialized

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if username is saved in localStorage
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
            navigate('/username'); // Redirect to username prompt if not set
        } else {
            setUsername(storedUsername);
            socket.emit('setUsername', storedUsername); // Emit username to the server
        }

        // Load contacts from localStorage if available
        const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
        if (storedContacts.length > 0) {
            setContacts(storedContacts); // Set contacts from localStorage
            setFilteredContacts(storedContacts); // Set filtered contacts for search
        }

        // Listen for the user list update from server
        socket.on('users', (userList) => {
            console.log("Updated User List:", userList);
            const filteredContacts = userList.filter(user => user !== storedUsername); // Exclude current user
            setContacts(filteredContacts); // Update contacts list
            setFilteredContacts(filteredContacts); // Set filtered contacts for search
            localStorage.setItem('contacts', JSON.stringify(filteredContacts)); // Store updated contacts
        });

        // Cleanup when component unmounts
        return () => {
            socket.off('users'); // Unsubscribe from 'users' event
        };
    }, [navigate]);

    useEffect(() => {
        // Filter contacts based on search query
        const results = contacts.filter(contact =>
            contact.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(results); // Update the filtered contacts state
    }, [searchQuery, contacts]);

    const handleContactClick = (contact) => {
        navigate(`/chat/${contact}`); // Navigate to the chat room with the selected contact
    };

    return (
        <div className="bg-gray-900 text-white h-screen">
            <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
                <div className="bg-gray-700 rounded-full w-10 h-10" />
                <span className="text-lg font-bold">{username}</span>
            </div>

            {/* Search input */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search a chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                    className="w-full p-2 rounded-lg bg-gray-800 text-gray-300"
                />
            </div>

            {/* Display contacts */}
            <div>
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => (
                        <div
                            key={index}
                            className="p-4 flex items-center justify-between hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleContactClick(contact)} // Navigate to the chat with the contact
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-700 rounded-full w-12 h-12" />
                                <div>
                                    <div className="font-bold">{contact}</div> {/* Display the contact's username */}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No contacts available</p>
                )}
            </div>
        </div>
    );
};

export default ContactList;
