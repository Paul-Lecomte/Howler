import React from 'react';
import { useNavigate } from 'react-router-dom';

const contacts = [
    { id: 1, name: 'Group name', lastMessage: 'Last post made in the group', time: '19:04' },
    { id: 2, name: 'Group name', lastMessage: 'Last post made in the group', time: '19:04' },
];

const ContactList = () => {
    const navigate = useNavigate();

    const handleContactClick = (id) => {
        navigate(`/chat/${id}`);
    };

    return (
        <div className="bg-gray-900 text-white h-screen">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
                <div className="bg-gray-700 rounded-full w-10 h-10" />
                <span className="text-lg font-bold">Username</span>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search a chat"
                    className="w-full p-2 rounded-lg bg-gray-800 text-gray-300"
                />
            </div>

            {/* Contact List */}
            <div>
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleContactClick(contact.id)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-700 rounded-full w-12 h-12" />
                            <div>
                                <div className="font-bold">{contact.name}</div>
                                <div className="text-sm text-gray-400">{contact.lastMessage}</div>
                            </div>
                        </div>
                        <div className="text-gray-400">{contact.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactList;