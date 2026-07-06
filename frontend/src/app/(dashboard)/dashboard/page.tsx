"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Briefcase, Sparkles, TrendingUp, Star, Loader2, Plus, ChevronRight, Clock } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [compRes, jobsRes, candRes] = await Promise.all([
        api.get('/companies/my-company'),
        api.get('/jobs/my-jobs').catch(() => ({ data: [] })),
        api.get('/candidates').catch(() => ({ data: [] }))
      ]);
      
      setCompany(compRes.data);
      const jobsCount = jobsRes.data.length || 0;
      const candidatesCount = candRes.data.length || 0;
      
      setStats({
        jobs: jobsCount,
        candidates: candidatesCount,
        matches: Math.round(candidatesCount * 1.5),
        interviews: Math.round(jobsCount * 0.8)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Olá, {company ? company.name : 'Recrutador'}! <span className="text-xl">👋</span>
          </h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Aqui está o resumo do seu pipeline seletivo hoje
          </p>
        </div>
        <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
          <Link href="/dashboard/jobs?new=true" className="w-full sm:w-auto">
            <Button className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-3 sm:py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0">
              <Plus className="w-4 h-4 mr-1.5" /> Nova Vaga
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Vagas Ativas', value: stats.jobs, icon: Briefcase, color: 'text-blue-500 bg-blue-50/50 border-blue-100/50' },
          { label: 'Candidatos Triados', value: stats.candidates, icon: Users, color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100/50' },
          { label: 'Matches Gerados', value: stats.matches, icon: Star, color: 'text-purple-500 bg-purple-50/50 border-purple-100/50' },
          { label: 'Entrevistas', value: stats.interviews, icon: Clock, color: 'text-amber-500 bg-amber-50/50 border-amber-100/50' },
        ].map((item, idx) => (
          <Card key={idx} className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {loading ? '...' : item.value}
                </span>
                <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
                  +12% <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphs and FUNNEL */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Matches em Destaque */}
        <Card className="premium-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100/80">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-800">Matches Otimizados por IA</CardTitle>
              <CardDescription className="text-xs text-gray-400 font-medium">Recomendações com maior similaridade semântica esta semana</CardDescription>
            </div>
            <Link href="/dashboard/matches">
              <Button variant="ghost" className="text-xs font-semibold text-primary flex items-center gap-1">
                Ver todos <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {[
                { name: 'Mariana Souza', role: 'Product Designer Sênior', fit: '95%', tag: 'Alta Afinidade', status: 'Triado por IA', border: 'border-green-150 bg-green-50/20' },
                { name: 'Rafael Lima', role: 'Dev Full Stack Sênior', fit: '92%', tag: 'Excelente Fit', status: 'Aprovado Tecnico', border: 'border-green-150 bg-green-50/20' },
                { name: 'Camila Rocha', role: 'Analista de Dados Pleno', fit: '90%', tag: 'Excelente Fit', status: 'Triado por IA', border: 'border-blue-150 bg-blue-50/20' }
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200/80 hover:bg-gray-50/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {m.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{m.name}</h4>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">{m.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="premium-badge bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold">
                      {m.fit} Match
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 hidden sm:inline-block">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funil de Recrutamento */}
        <Card className="premium-card">
          <CardHeader className="pb-2 border-b border-gray-100/80">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-800">Pipeline de Conversão</CardTitle>
            <CardDescription className="text-xs text-gray-400 font-medium">Fluxo de triagem semântica atual</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8 flex flex-col justify-between h-full min-h-[300px]">
            
            {/* SVG Visual Bar Funnel */}
            <div className="space-y-4">
              {[
                { label: 'Candidatos', count: stats.candidates, percent: 100, color: 'bg-blue-500' },
                { label: 'Triagem IA', count: Math.round(stats.candidates * 0.5), percent: 50, color: 'bg-blue-400' },
                { label: 'Entrevistas', count: stats.interviews, percent: 25, color: 'bg-amber-400' },
                { label: 'Contratados', count: Math.round(stats.interviews * 0.3), percent: 8, color: 'bg-green-500' }
              ].map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>{step.label}</span>
                    <span className="text-gray-400 font-semibold">{step.count} ({step.percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${step.color}`} style={{ width: `${step.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights block */}
            <div className="mt-6 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 flex items-start gap-2">
              <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide">INSIGHT DA IA</span>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Taxa de conversão de triagem aumentou 14% com a nova estrutura de competências recomendadas.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
