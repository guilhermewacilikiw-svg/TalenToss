"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('CANDIDATE'); // CANDIDATE ou COMPANY
  const [errorMsg, setErrorMsg] = useState('');
  
  // New fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [tradeName, setTradeName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
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
      
      if (loggedInRole === 'COMPANY') {
        router.push('/dashboard/jobs');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || err?.response?.data?.message || 'Credenciais inválidas ou erro no servidor.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-md border">
        <div className="flex flex-col items-center justify-center mb-6">
          <Logo width={160} height={45} className="mb-4" />
          <h1 className="text-xl font-semibold text-gray-700">
            {isRegister ? 'Crie sua conta' : 'Acesse sua conta'}
          </h1>
        </div>
        
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {isRegister && (
            <div>
              <Label>Tipo de Conta</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mb-4"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CANDIDATE">Candidato</option>
                <option value="COMPANY">Empresa</option>
              </select>
              
              {role === 'CANDIDATE' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" placeholder="XX.XXX.XXX/0001-XX" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="corporateName">Razão Social</Label>
                    <Input id="corporateName" placeholder="Sua Empresa LTDA" value={corporateName} onChange={(e) => setCorporateName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="tradeName">Nome Fantasia</Label>
                    <Input id="tradeName" placeholder="Sua Empresa" value={tradeName} onChange={(e) => setTradeName(e.target.value)} required />
                  </div>
                </div>
              )}
            </div>
          )}
          <Button type="submit" className="w-full">
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </Button>
          <div className="text-center mt-4">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-primary underline">
              {isRegister ? 'Já tenho uma conta (Login)' : 'Criar nova conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
