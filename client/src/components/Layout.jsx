import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />
      <div className="h-[80px]" />
      <main className="flex-1 text-slate-900">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
