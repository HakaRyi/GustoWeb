import './App.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Header from './components/GlobalStyle/Header.js';
import Footer from './components/GlobalStyle/Footer.js';
import Restaurants from './pages/Restaurants.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import { publicRoutes } from '~/routes';
import { useState, useEffect } from 'react';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
     const [isAdmin, setIsAdmin] = useState(false);
   
  return (
   <Router>
     <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </main>
      <Footer  />
    </Router>
  );
}

export default App;
