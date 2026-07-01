"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, TrendingUp, Users, Target, Clock, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileBarChart className="w-8 h-8 text-primary" />
            Relatórios e Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Métricas detalhadas de atração, conversão e fechamento de vagas.
          </p>
        </div>
        <Button variant="outline" className="rounded-full shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Exportar PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Tempo Médio de Fechamento</p>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">14 dias</h3>
              <p className="text-xs font-medium text-success flex items-center mt-2">
                <ArrowDownRight className="w-3 h-3 mr-1" /> 2 dias mais rápido
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Qualidade de Match (IA)</p>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">89%</h3>
              <p className="text-xs font-medium text-success flex items-center mt-2">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +4% vs último mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Candidatos Atraídos</p>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">1,245</h3>
              <p className="text-xs font-medium text-success flex items-center mt-2">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12% vs último mês
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">Taxa de Conversão</p>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">22%</h3>
              <p className="text-xs font-medium text-destructive flex items-center mt-2">
                <ArrowDownRight className="w-3 h-3 mr-1" /> -1% vs último mês
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráfico de Barras Mock */}
        <Card className="lg:col-span-2 rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Aplicações ao longo do tempo</CardTitle>
            <CardDescription>Volume de inscrições recebidas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between h-64 pt-6 gap-2">
            {[30, 45, 35, 60, 50, 85].map((val, i) => (
              <div key={i} className="relative flex-1 flex flex-col justify-end items-center group">
                <div 
                  className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-sm"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="mt-2 text-xs font-medium text-gray-500">
                  {['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'][i]}
                </span>
                {/* Tooltip */}
                <div className="absolute -top-8 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val * 12}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Origem dos Candidatos */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Origem do Tráfego</CardTitle>
            <CardDescription>De onde vêm seus matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {[
                { label: 'Busca Ativa (IA)', percent: 65, color: 'bg-primary' },
                { label: 'LinkedIn', percent: 20, color: 'bg-blue-400' },
                { label: 'Indicação Interna', percent: 10, color: 'bg-emerald-400' },
                { label: 'Outros', percent: 5, color: 'bg-gray-300' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
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
