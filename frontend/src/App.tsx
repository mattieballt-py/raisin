import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveStream from '../pages/LiveStream';
import Home from '../pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<LiveStream />} />
      </Routes>
    </Router>
  );
}

export default App;
