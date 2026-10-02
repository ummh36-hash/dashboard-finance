import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ activePage, setActivePage, children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070D0B] text-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <Header 
          activePage={activePage} 
          setActivePage={setActivePage} 
          setIsMobileOpen={setIsMobileOpen} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
