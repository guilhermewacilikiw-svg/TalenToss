"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Plus, AlertCircle, MoreHorizontal, Edit, LayoutDashboard, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';

function JobsContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Job State
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      await api.put(`/jobs/${jobId}`, { status: newStatus });
      loadJobs();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status da vaga');
    }
  };

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditDescription(job.description);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/jobs/${editingJob.id}`, {
        title: editTitle,
        description: editDescription
      });
      setEditingJob(null);
      loadJobs();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar as edições');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gerenciador de Vagas</h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Gerencie, edite ou encerre o pipeline de vagas da sua organização
          </p>
        </div>
        <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
          <Link href="/dashboard/jobs/new" className="w-full sm:w-auto">
            <Button className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-3 sm:py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-4 h-4 mr-1.5" /> Nova Vaga
            </Button>
          </Link>
        </div>
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
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Criada Em</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4 text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-xs font-bold text-gray-400 animate-pulse">Carregando vagas...</TableCell>
                  </TableRow>
                ) : jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-xs font-semibold text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-6 h-6 text-gray-300" />
                        <span>Nenhuma vaga cadastrada.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id} className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-all">
                      <TableCell className="font-bold text-gray-800 py-4 pl-6">{job.title}</TableCell>
                      <TableCell className="py-4">
                        {job.status === 'OPEN' && <span className="premium-badge bg-green-50 text-green-700 border border-green-100 text-[10px]">Aberta</span>}
                        {job.status === 'CLOSED' && <span className="premium-badge bg-red-50 text-red-700 border border-red-100 text-[10px]">Encerrada</span>}
                        {job.status === 'DRAFT' && <span className="premium-badge bg-gray-100 text-gray-700 border border-gray-200 text-[10px]">Rascunho</span>}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-gray-400 text-xs">
                        {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Ações da Vaga</DropdownMenuLabel>
                            
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/jobs/${job.id}`} className="cursor-pointer flex items-center w-full">
                                <LayoutDashboard className="mr-2 h-4 w-4 text-blue-600" /> Ver Kanban (ATS)
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => openEditModal(job)}>
                              <Edit className="mr-2 h-4 w-4 text-amber-600" /> Editar Informações
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {job.status === 'OPEN' ? (
                              <DropdownMenuItem className="cursor-pointer flex items-center text-red-600 focus:text-red-600" onClick={() => handleUpdateStatus(job.id, 'CLOSED')}>
                                <Lock className="mr-2 h-4 w-4" /> Encerrar Manualmente
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="cursor-pointer flex items-center text-green-600 focus:text-green-600" onClick={() => handleUpdateStatus(job.id, 'OPEN')}>
                                <Unlock className="mr-2 h-4 w-4" /> Reabrir Vaga
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Job Modal */}
      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Vaga</DialogTitle>
            <DialogDescription>Altere as informações públicas da vaga.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Cargo / Título</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Descrição</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="min-h-[150px] resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingJob(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">Salvar Mudanças</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
