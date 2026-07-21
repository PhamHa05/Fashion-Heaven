import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/news" element={<News />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
