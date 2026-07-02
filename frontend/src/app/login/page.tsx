"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { Briefcase, UserCircle, KeyRound, Mail, Sparkles, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('CANDIDATE'); // CANDIDATE ou COMPANY
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // New fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [tradeName, setTradeName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      if (isRegister) {
        await api.post('/auth/register', { 
          email, password, role,
          firstName, lastName, cnpj, corporateName, tradeName
        });
      }
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.access_token);
      
      const loggedInRole = res.data.role;
      
      if (loggedInRole === 'COMPANY' || loggedInRole === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || err?.response?.data?.message || 'Credenciais inválidas ou erro no servidor.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 font-sans selection:bg-primary/10">
      <div className="w-full max-w-[440px] bg-white border border-gray-100/90 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo width={160} height={46} className="mb-6" />
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {isRegister ? 'Crie sua conta no TalenToss' : 'Acesse sua conta'}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1.5">
            {isRegister ? 'Comece a triar candidatos com IA hoje' : 'Bem-vindo de volta ao recrutamento inteligente'}
          </p>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center animate-in fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-gray-700">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="email" 
                type="email" 
                placeholder="Ex: seuemail@empresa.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoading} 
                className="pl-9 h-10 premium-input w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold text-gray-700">Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="password" 
                type="password" 
                placeholder="Sua senha secreta"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isLoading} 
                className="pl-9 h-10 premium-input w-full"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-4 pt-2 border-t border-gray-100/80 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">Tipo de Conta</Label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100/60 p-0.5 rounded-lg border">
                  <button 
                    type="button"
                    onClick={() => setRole('CANDIDATE')}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                      role === 'CANDIDATE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <UserCircle className="w-3.5 h-3.5" /> Candidato
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole('COMPANY')}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                      role === 'COMPANY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Empresa
                  </button>
                </div>
              </div>
              
              {role === 'CANDIDATE' ? (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-bold text-gray-700">Nome</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={isLoading} className="h-10 premium-input" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-bold text-gray-700">Sobrenome</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={isLoading} className="h-10 premium-input" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="space-y-1.5">
                    <Label htmlFor="cnpj" className="text-xs font-bold text-gray-700">CNPJ</Label>
                    <Input id="cnpj" placeholder="XX.XXX.XXX/0001-XX" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required disabled={isLoading} className="h-10 premium-input w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="corporateName" className="text-xs font-bold text-gray-700">Razão Social</Label>
                    <Input id="corporateName" placeholder="Sua Empresa LTDA" value={corporateName} onChange={(e) => setCorporateName(e.target.value)} required disabled={isLoading} className="h-10 premium-input w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tradeName" className="text-xs font-bold text-gray-700">Nome Fantasia (Imutável depois)</Label>
                    <Input id="tradeName" placeholder="Nome comercial" value={tradeName} onChange={(e) => setTradeName(e.target.value)} required disabled={isLoading} className="h-10 premium-input w-full" />
                  </div>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 h-10 font-semibold shadow-sm border-0 mt-2" disabled={isLoading}>
            {isLoading ? 'Processando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
          </Button>

          <div className="text-center mt-6 pt-4 border-t border-gray-100/80">
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-xs font-semibold text-primary hover:underline" 
              disabled={isLoading}
            >
              {isRegister ? 'Já tenho uma conta (Login)' : 'Criar nova conta grátis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
