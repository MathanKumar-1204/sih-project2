import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Lang from './Lang';
import Download from './Download';
import Feedback from './Feedback';
// Import the TicketPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lang" element={<Lang />} />
        <Route path="/downloads" element={<Download />} />
        <Route path="/feedback" element={<Feedback />} />

      </Routes>
    </Router>
  );
};

export default App;
