import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* الهيدر */}
      <Navbar />

      {/* المحتوى الرئيسي */}
      <main className="flex-grow container mx-auto my-6 py-6 mt-16">
        <Outlet />
      </main>

      {/* الفوتر */}
      <Footer />
    </div>
  );
}
