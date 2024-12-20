import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactList from './pages/ContactList';
import ChatRoom from './pages/ChatRoom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ContactList />} />
                <Route path="/chat/:id" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
};

export default App;
