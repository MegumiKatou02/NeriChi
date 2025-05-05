'use client';

import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar'
import Footer from './Footer';
import AuthModal from '../auth/AuthModal';
import { useUIStore } from '@/app/store/store';

interface MainLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const { isAuthModalOpen } = useUIStore();

  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className={`flex-grow pt-16 ${fullWidth ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8'} animate-slide-up`}>
        {children}
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal />}
    </div>
  );
} 