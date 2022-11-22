import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, SignIn, Reports } from './pages';

import 'antd/dist/antd.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/reports/:id" element={<Reports />} />
            </Routes>
        </Router>
    );
};

export default App;
