"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { Logo } from '@/components/Logo';
import { LayoutDashboard, Briefcase, Users, Star, Clock, CreditCard, Settings, Building2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    api.get('/companies/my-company')
      .then(res => setCompany(res.data))
      .catch(() => {});
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vagas', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Banco de Talentos', href: '/dashboard/candidates', icon: Users },
    { name: 'Matches', href: '/dashboard/matches', icon: Star },
    { name: 'Entrevistas', href: '/dashboard/interviews', icon: Clock },
    { name: 'Planos', href: '/dashboard/plans', icon: CreditCard },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FA] text-foreground font-sans">
      <aside className="w-64 flex flex-col border-r border-gray-100 bg-white">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Logo width={130} height={36} />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3 px-2 mb-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
            <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs font-bold text-gray-800 truncate">
              {company ? (company.tradeName || company.name) : 'Minha Empresa'}
            </span>
          </div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {company ? company.name?.[0]?.toUpperCase() : 'E'}
              </div>
              <div className="flex flex-col overflow-hidden max-w-[120px]">
                <span className="text-xs font-bold text-gray-900 truncate">Administrador</span>
                <span className="text-[10px] text-gray-400 truncate">{company?.cnpj || 'Sem CNPJ'}</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F5F7FA]">
        <header className="h-16 flex items-center justify-end px-8">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
