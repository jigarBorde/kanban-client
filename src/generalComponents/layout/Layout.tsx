// src/layout/Layout.tsx
import React from 'react';
import Header from '../Header';
import { Toaster } from "@/components/ui/sonner"

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 p-4 bg-gray-100">
                {children}
            </main>
            <Toaster />
        </div>
    );
};

export default Layout;
