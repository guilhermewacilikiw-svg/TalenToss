"use client";
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', requirements: '' });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vagas</h2>
          <p className="text-muted-foreground">Gerencie as vagas da sua empresa e encontre os melhores talentos.</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>Criar Nova Vaga</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Vaga</SheetTitle>
              <SheetDescription>
                A IA vai ler esses dados para conectar com os candidatos perfeitos.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateJob} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Vaga</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Ex: Engenheiro Front-end Sênior" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Descreva as responsabilidades..." 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requisitos (separados por vírgula)</Label>
                <Input 
                  id="requirements" 
                  value={formData.requirements} 
                  onChange={e => setFormData({...formData, requirements: e.target.value})} 
                  placeholder="Ex: React, Node.js, TypeScript" 
                  required 
                />
              </div>
              <SheetFooter className="mt-8">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publicar Vaga'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vagas Ativas</CardTitle>
          <CardDescription>Você tem {jobs.length} vagas em andamento no momento.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Candidatos</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground animate-pulse">Carregando vagas...</TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Nenhuma vaga cadastrada.</TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Link href={`/dashboard/jobs/${job.id}/applications`}>
                        <Button variant="outline" size="sm">Ver Aplicações</Button>
                      </Link>
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        <Button variant="default" size="sm">IA Matching</Button>
                      </Link>
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
