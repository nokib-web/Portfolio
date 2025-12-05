import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-display">
            <Header />
            <div className="flex-1 flex max-w-7xl mx-auto overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-24 flex flex-col">
                    <div className="flex-grow">
                        {children}
                    </div>
                    
                </main>
                
            </div>
            <Footer />
        </div>

    );
};

export default Layout;
