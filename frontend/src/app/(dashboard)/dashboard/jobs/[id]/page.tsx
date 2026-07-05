"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { BrainCircuit, Star, ArrowLeft, CalendarIcon, MessageSquare, Briefcase, Mail } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const KANBAN_COLUMNS = [
  { id: 'APPLIED', title: 'Novos / Recomendados', color: 'bg-slate-100 border-slate-300' },
  { id: 'SCREENING', title: 'Triagem', color: 'bg-blue-50 border-blue-200' },
  { id: 'INTERVIEW', title: 'Em Entrevista', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'HIRED', title: 'Finalizado (Contratado)', color: 'bg-emerald-50 border-emerald-200' },
  { id: 'REJECTED', title: 'Eliminado', color: 'bg-red-50 border-red-200' }
];

export default function JobKanbanPage({ params }: { params: { id: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatCandidate, setChatCandidate] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Interview Scheduling State
  const [scheduleCandidate, setScheduleCandidate] = useState<any>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    loadCandidates();
  }, [params.id]);

  const loadCandidates = async () => {
    try {
      const res = await api.get(`/jobs/${params.id}/matching`);
      // O backend retorna um array com { id, firstName, lastName, headline, employabilityScore, match_score, application_status }
      setCandidates(res.data.map((c: any) => ({
        ...c,
        application_status: c.application_status || 'APPLIED' // Default
      })));
    } catch (err) {
      console.error('Erro ao buscar candidatos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('candidateId', candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    if (!candidateId) return;

    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, application_status: newStatus } : c));

    try {
      await api.patch(`/jobs/${params.id}/candidates/${candidateId}/status`, { status: newStatus });
      if (newStatus === 'HIRED') {
        alert('Candidato finalizado com sucesso! A vaga foi encerrada e não receberá mais candidaturas.');
      }
    } catch (error) {
      console.error('Erro ao mudar status:', error);
      loadCandidates(); // Revert on failure
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
        candidateId: scheduleCandidate.id,
        startDateTime,
        endDateTime
      });

      alert('Entrevista agendada e convites do Google Meet enviados!');
      setScheduleCandidate(null);
      loadCandidates();
    } catch (err) {
      console.error(err);
      alert('Erro ao agendar entrevista. Verifique a integração com o Google Calendar.');
    }
  };

  const openChat = async (candidate: any) => {
    setChatCandidate(candidate);
    setMessages([]);
    try {
      // Para pegar mensagens, precisamos do applicationId. Vamos buscar o App primeiro se existir.
      // O endpoint /jobs/:id/matching não traz a aplicação inteira. 
      // Por simplicidade na demo, usaremos o backend para resolver.
      // Como a rota precisa do :id da application, vou usar uma nova rota ou assumir que o backend faz isso.
      // Espera, a rota do backend pede applications/:id/messages
      // Precisamos do ID da application.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kanban de Recrutamento (ATS)</h2>
          <p className="text-muted-foreground">Arraste os candidatos sugeridos pela Inteligência Artificial entre as fases da vaga.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {KANBAN_COLUMNS.map(col => (
            <div 
              key={col.id} 
              className={`w-80 flex flex-col rounded-lg border-2 ${col.color} p-2 bg-opacity-50`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="font-bold text-sm text-slate-700 mb-3 px-2 flex justify-between items-center">
                {col.title}
                <span className="bg-white rounded-full px-2 py-0.5 text-xs border shadow-sm">
                  {candidates.filter(c => c.application_status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto min-h-[500px]">
                {candidates.filter(c => c.application_status === col.id).map(c => (
                  <Card 
                    key={c.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, c.id)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-slate-200"
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm leading-tight">{c.firstName} {c.lastName}</h4>
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold">
                          <Star className="w-3 h-3 fill-primary" /> {c.employabilityScore}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.headline}</p>
                      
                      <div className="flex items-center gap-2 justify-between">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          c.match_score >= 85 ? 'bg-success/20 text-success' : 
                          c.match_score >= 70 ? 'bg-warning/20 text-warning' : 
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {c.match_score}% MATCH IA
                        </span>
                        
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setChatCandidate(c)}>
                            <MessageSquare className="w-3 h-3 text-slate-600" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 bg-blue-50 hover:bg-blue-100 border-blue-200" onClick={() => setScheduleCandidate(c)}>
                            <CalendarIcon className="w-3 h-3 text-blue-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Agendamento */}
      <Dialog open={!!scheduleCandidate} onOpenChange={(open) => !open && setScheduleCandidate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar Entrevista / Reunião</DialogTitle>
            <DialogDescription>
              Agende um bate-papo com {scheduleCandidate?.firstName}. Você pode marcar múltiplas entrevistas. O link do Google Meet será gerado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Data</label>
              <input type="date" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Início</label>
                <input type="time" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Fim</label>
                <input type="time" className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleCandidate(null)}>Cancelar</Button>
            <Button onClick={handleSchedule} className="bg-blue-600 hover:bg-blue-700 text-white">Criar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Chat Provisório */}
      <Dialog open={!!chatCandidate} onOpenChange={(open) => !open && setChatCandidate(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Chat com {chatCandidate?.firstName}
            </DialogTitle>
            <DialogDescription>Converse diretamente com o candidato pela plataforma.</DialogDescription>
          </DialogHeader>
          <div className="h-[300px] border rounded-md p-4 bg-slate-50 flex flex-col gap-3 overflow-y-auto">
            {/* Mensagem simulada até o backend route do chat estar totalmente interligado pelo frontend */}
            <div className="flex flex-col gap-1 max-w-[80%] self-end">
              <div className="bg-primary text-white p-2.5 rounded-lg rounded-tr-none text-sm">
                Olá {chatCandidate?.firstName}, vimos seu perfil e o Match de {chatCandidate?.match_score}% chamou nossa atenção! Teria disponibilidade para um bate-papo?
              </div>
              <span className="text-[10px] text-muted-foreground text-right">Você • Agora</span>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <div className="flex w-full gap-2">
              <input type="text" placeholder="Digite sua mensagem..." className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm" />
              <Button>Enviar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
