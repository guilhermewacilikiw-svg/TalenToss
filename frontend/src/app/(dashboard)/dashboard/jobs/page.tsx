"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Loader2, Briefcase, Plus, Calendar, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', requirements: '' });

  useEffect(() => {
    loadJobs();
    if (searchParams.get('new') === 'true') {
      setIsSheetOpen(true);
    }
  }, [searchParams]);

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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const requirementsArray = formData.requirements.split(',').map(r => r.trim()).filter(Boolean);
      await api.post('/jobs', {
        title: formData.title,
        description: formData.description,
        requirements: requirementsArray,
        status: 'OPEN'
      });
      setIsSheetOpen(false);
      setFormData({ title: '', description: '', requirements: '' });
      loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWithAi = async () => {
    setIsAiGenerating(true);
    // Simulate high quality B2B AI job generation
    setTimeout(() => {
      setFormData({
        title: 'Desenvolvedor React / Node.js Pleno',
        description: 'Buscamos um desenvolvedor apaixonado por construir interfaces rápidas e escaláveis usando Next.js, TailwindCSS e integrando APIs REST/GraphQL escritas em Node.js com TypeScript.',
        requirements: 'React, Next.js, Node.js, TypeScript, REST API, TailwindCSS'
      });
      setIsAiGenerating(false);
    }, 1200);
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger render={<Button className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0"><Plus className="w-3.5 h-3.5 mr-1.5" /> Criar Nova Vaga</Button>} />
          <SheetContent className="sm:max-w-[520px]">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-lg font-bold">Cadastrar Nova Vaga</SheetTitle>
              <SheetDescription className="text-xs text-gray-400 font-medium">
                Os detalhes inseridos servirão como base para o cruzamento de dados com IA.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateJob} className="space-y-5 mt-6">
              
              {/* Magic IA Trigger Button */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary tracking-wide uppercase">Assistente de Escrita</span>
                    <span className="text-[9px] text-gray-500 font-medium">Gerar template de vaga automaticamente</span>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={generateWithAi} 
                  disabled={isAiGenerating}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-[10px] tracking-wider uppercase rounded-full h-8 px-4 border-0 shadow-sm shrink-0"
                >
                  {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Gerar com IA'}
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold text-gray-700">Título da Vaga</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Ex: Engenheiro Front-end Sênior" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700">Descrição</Label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="flex min-h-[120px] w-full rounded-lg border border-gray-200/80 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                  placeholder="Responsabilidades, atribuições e cultura..." 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="requirements" className="text-xs font-bold text-gray-700">Requisitos (separados por vírgula)</Label>
                <Input 
                  id="requirements" 
                  value={formData.requirements} 
                  onChange={e => setFormData({...formData, requirements: e.target.value})} 
                  placeholder="Ex: React, Node.js, TypeScript" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>

              <SheetFooter className="mt-8 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 h-10 font-bold shadow-sm border-0">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publicar Vaga'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table Container */}
      <Card className="premium-card">
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}
