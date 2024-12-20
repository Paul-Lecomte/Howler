import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './pages/ContactList';
import ChatRoom from './pages/ChatRoom';
import UsernamePrompt from './pages/UsernamePrompt';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UsernamePrompt />} />
                <Route path="/contacts" element={<ContactList />} />
                <Route path="/chat/:username" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
};

export default App;
