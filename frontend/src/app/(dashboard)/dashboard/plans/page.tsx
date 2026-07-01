"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function PlansPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const res = await api.get('/companies/my-company');
      setCompany(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground">Carregando seus planos...</div>;
  }

  const isFree = company?.plan === 'FREE';
  const credits = company?.credits || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Potencialize seu Recrutamento</h1>
        <p className="text-lg text-gray-600">
          Encontre os melhores talentos mais rápido com nossa IA. Escolha o plano perfeito para o seu momento.
        </p>
      </div>

      {isFree && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Seu saldo atual</h3>
              <p className="text-gray-600">
                Você tem <strong className="text-primary text-xl">{credits}</strong> vaga(s) disponível(is) para publicar.
              </p>
            </div>
          </div>
          {credits === 0 && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              Saldo esgotado
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano Flex (Pay per Job) */}
        <Card className={`relative overflow-hidden flex flex-col ${isFree ? 'border-primary shadow-md' : 'border-border/50'}`}>
          {isFree && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              PLANO ATUAL
            </div>
          )}
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold">Flex (Avulso)</CardTitle>
            <CardDescription className="mt-2 text-base">Ideal para contratações pontuais</CardDescription>
            <div className="mt-6 flex justify-center items-baseline text-5xl font-extrabold text-gray-900">
              R$ 149
              <span className="text-xl font-medium text-gray-500 ml-2">/vaga</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                Vaga ativa por 30 dias
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                Triagem por IA ilimitada
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                Agendamento via Google Meet
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6 pb-8">
            <Button className="w-full text-lg py-6" variant={isFree ? 'outline' : 'default'} onClick={() => alert('Integração de pagamento em breve!')}>
              {isFree ? 'Comprar Vaga Avulsa' : 'Mudar para Flex'}
            </Button>
          </CardFooter>
        </Card>

        {/* Plano Pro (SaaS) */}
        <Card className={`relative overflow-hidden flex flex-col bg-slate-900 text-white shadow-xl ${!isFree ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}>
          {!isFree && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              PLANO ATUAL
            </div>
          )}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl font-bold text-white">Pro (Assinatura)</CardTitle>
            <CardDescription className="mt-2 text-base text-gray-300">Para empresas em ritmo de crescimento</CardDescription>
            <div className="mt-6 flex justify-center items-baseline text-5xl font-extrabold text-white">
              R$ 499
              <span className="text-xl font-medium text-gray-400 ml-2">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Até 10 vagas simultâneas
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Destaque especial para candidatos
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Suporte prioritário
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                Faturamento unificado (NFS-e)
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-6 pb-8">
            <Button className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-0" onClick={() => alert('Integração de pagamento em breve!')}>
              {!isFree ? 'Gerenciar Assinatura' : 'Assinar o Plano Pro'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
