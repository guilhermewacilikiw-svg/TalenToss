"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { Logo } from '@/components/Logo';
import { LayoutDashboard, Briefcase, Users, Star, Clock, FileBarChart, Settings, Building2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vagas', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Candidatos', href: '/dashboard/candidates', icon: Users },
    { name: 'Matches', href: '/dashboard/matches', icon: Star },
    { name: 'Entrevistas', href: '/dashboard/interviews', icon: Clock },
    { name: 'Planos', href: '/dashboard/plans', icon: FileBarChart },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-sans">
      <aside className="w-64 flex flex-col border-r border-border/60 bg-white">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Logo width={160} height={45} />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border/60 mt-auto">
          <div className="flex items-center gap-3 px-2 mb-4">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-700">Tech Solutions Ltda.</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=5" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">Juliana Martins</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F5F7FA]">
        <header className="h-16 flex items-center justify-end px-8">
          {/* Top header can be mostly empty or have a notification bell */}
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-auto px-8 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
