import React from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { Logo } from '@/components/Logo';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <main className="flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full border-x bg-background shadow-sm">
        <header className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-2">
            <Logo width={130} height={35} />
            <span className="text-xs font-semibold text-gray-500 ml-2 px-2 py-0.5 bg-gray-100 rounded-full">Candidato</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/candidate/dashboard" className="text-primary">Meu Perfil</Link>
            <Link href="/candidate/jobs" className="text-muted-foreground hover:text-foreground">Vagas Recomendadas</Link>
            <Link href="/candidate/applications" className="text-muted-foreground hover:text-foreground">Minhas Candidaturas</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              U
            </div>
            <LogoutButton />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
