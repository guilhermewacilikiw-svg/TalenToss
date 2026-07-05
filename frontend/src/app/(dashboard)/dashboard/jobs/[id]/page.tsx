"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { BrainCircuit, Star, ArrowLeft, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function JobMatchingPage({ params }: { params: { id: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    loadCandidates();
  }, [params.id]);

  const loadCandidates = async () => {
    try {
      const res = await api.get(`/jobs/${params.id}/matching`);
      setCandidates(res.data);
    } catch (err) {
      console.error('Erro ao buscar matching:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    try {
      if (!date || !startTime || !endTime) {
        alert('Preencha data e horários.');
        return;
      }
      const startDateTime = new Date(`${date}T${startTime}`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}`).toISOString();

      await api.post('/interviews', {
        jobId: params.id,
        candidateId: selectedCandidate.id,
        startDateTime,
        endDateTime
      });

      alert('Entrevista agendada e convites enviados com sucesso!');
      setSelectedCandidate(null);
      loadCandidates(); // recarrega para atualizar o status
    } catch (err) {
      console.error(err);
      alert('Erro ao agendar entrevista. Certifique-se de que sua conta do Google Calendar está conectada na página de Entrevistas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Matching de Inteligência Artificial</h2>
          <p className="text-muted-foreground">Resultados ordenados por similaridade vetorial com a vaga.</p>
        </div>
      </div>

      <Card className="border-primary/50">
        <CardHeader className="bg-primary/5 border-b border-primary/20 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-primary flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> 
              Candidatos Recomendados pela IA
            </CardTitle>
            <CardDescription>O algoritmo comparou a descrição da vaga com o perfil inteligente dos candidatos usando PgVector.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Headline (Extraído pela IA)</TableHead>
                  <TableHead className="text-center">Score Empregabilidade</TableHead>
                  <TableHead className="text-center">Compatibilidade (Match)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold whitespace-nowrap">{c.firstName} {c.lastName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{c.headline || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-warning" fill="currentColor" />
                        <span className="font-medium">{c.employabilityScore || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        c.match_score >= 85 ? 'bg-success/20 text-success' : 
                        c.match_score >= 70 ? 'bg-warning/20 text-warning' : 
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {c.match_score}% Match
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {c.application_status === 'INTERVIEW' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                          Em Entrevista
                        </span>
                      ) : c.application_status === 'REJECTED' ? (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-200">
                          Rejeitado
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-200">
                          Aguardando
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {c.application_status === 'INTERVIEW' ? (
                        <Button variant="secondary" size="sm" disabled>Agendado</Button>
                      ) : (
                        <Button onClick={() => setSelectedCandidate(c)} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                          <CalendarIcon className="w-3 h-3 mr-1.5" />
                          Agendar Entrevista
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Entrevista Oficial</DialogTitle>
            <DialogDescription>
              Isso criará um evento no seu Google Calendar com um link automático do Meet para {selectedCandidate?.firstName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Data da Entrevista</label>
              <input 
                type="date" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={date} onChange={e => setDate(e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Horário Inicial</label>
                <input 
                  type="time" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={startTime} onChange={e => setStartTime(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Horário Final</label>
                <input 
                  type="time" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={endTime} onChange={e => setEndTime(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Cancelar</Button>
            <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700 text-white">Confirmar Agendamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
