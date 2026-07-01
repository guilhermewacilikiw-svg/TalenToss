"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
      <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
    </Button>
  );
}
