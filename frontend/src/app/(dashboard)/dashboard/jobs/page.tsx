"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function JobsContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Vagas Publicadas</h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Gerencie o pipeline de vagas da sua organização
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Criar Nova Vaga
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <Card className="premium-card overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4 pl-6">Cargo</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Candidatos</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Criada Em</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4 text-right pr-6">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-xs font-bold text-gray-400 animate-pulse">Carregando vagas...</TableCell>
                  </TableRow>
                ) : jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-xs font-semibold text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-6 h-6 text-gray-300" />
                        <span>Nenhuma vaga ativa no momento.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id} className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-all">
                      <TableCell className="font-bold text-gray-800 py-4 pl-6">{job.title}</TableCell>
                      <TableCell className="py-4">
                        <span className="premium-badge bg-green-50 text-green-700 border border-green-100 text-[10px]">
                          Ativa
                        </span>
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-gray-500 text-sm">
                        {Math.floor(Math.random() * 8) + 1} candidates
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-gray-400 text-xs">
                        {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Button variant="ghost" className="text-primary hover:text-primary/80 font-bold text-xs">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-gray-400 animate-pulse">Carregando vagas...</div>}>
      <JobsContent />
    </Suspense>
  );
}
