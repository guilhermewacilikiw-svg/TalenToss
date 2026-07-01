"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Briefcase, Users, Star, Clock, Bell, Plus, MoreHorizontal, Bot, CheckCircle2 } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ jobs: 24, candidates: 312, matches: 87, interviews: 16 });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Olá, Juliana! <span className="text-2xl">👋</span></h2>
          <p className="text-gray-500 mt-1 font-medium">Aqui está o resumo do seu recrutamento hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-primary text-white rounded-full px-6 font-medium shadow-sm hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Nova Vaga
          </Button>
        </div>
      </div>

      {/* 4 Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Vagas Ativas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.jobs}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">+3 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Candidatos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.candidates}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">+18 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Matches</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.matches}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">+12 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Entrevistas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.interviews}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">+4 esta semana</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Matches em Destaque */}
        <Card className="rounded-2xl border-0 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Matches em Destaque</CardTitle>
            <Button variant="link" className="text-primary font-medium text-sm">Ver todos</Button>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6 mt-4">
              {[
                { name: 'Mariana Souza', role: 'Product Designer', loc: 'São Paulo, SP', match: 95, img: 1 },
                { name: 'Rafael Lima', role: 'Desenvolvedor Full Stack Sênior', loc: 'Remoto', match: 92, img: 2 },
                { name: 'Camila Rocha', role: 'Analista de Dados Pleno', loc: 'Rio de Janeiro, RJ', match: 90, img: 3 },
                { name: 'Lucas Ferreira', role: 'DevOps Engineer Sênior', loc: 'Remoto', match: 88, img: 4 },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={`https://i.pravatar.cc/150?img=${m.img + 10}`} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{m.name}</h4>
                      <p className="text-xs font-medium text-gray-500">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-success mb-1">Compatibilidade</p>
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: `${m.match}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{m.match}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funil de Recrutamento */}
        <Card className="rounded-2xl border-0 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Funil de Recrutamento</CardTitle>
            <span className="text-sm font-medium text-gray-500">Este mês</span>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center py-8">
            <div className="space-y-3 px-4">
              {[
                { label: 'Candidatos', count: 312, color: 'bg-blue-600', w: '100%' },
                { label: 'Triagem IA', count: 156, color: 'bg-blue-400', w: '85%' },
                { label: 'Entrevista', count: 47, color: 'bg-blue-300', w: '70%' },
                { label: 'Proposta', count: 16, color: 'bg-emerald-300', w: '55%' },
                { label: 'Contratados', count: 6, color: 'bg-emerald-500', w: '40%' },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 flex justify-center">
                    <div 
                      className={`h-10 ${step.color} rounded-sm flex items-center justify-center transition-all`}
                      style={{ width: step.w }}
                    >
                      <span className="text-white text-xs font-semibold">{step.label}</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className="text-xs font-medium text-gray-500">{step.label}</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">{step.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
