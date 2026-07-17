import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotButton from './ChatbotButton';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
}