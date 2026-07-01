"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar as CalendarIcon, Video, CheckCircle2, MoreHorizontal, User, AlertCircle, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Interview Form State
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    jobId: '',
    candidateId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    loadData();
    // Check URL for callback flags
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      alert('Google Agenda conectado com sucesso!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch status
      const statusRes = await api.get('/google/status');
      setGoogleConnected(statusRes.data.connected);

      // Fetch interviews
      const intRes = await api.get('/interviews');
      setInterviews(intRes.data);

      // Fetch lists for the modal
      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data);
      const candRes = await api.get('/candidates');
      setCandidates(candRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const res = await api.get('/google/auth');
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert('Erro ao conectar com Google. Verifique se as variáveis de ambiente estão configuradas.');
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await api.post('/google/disconnect');
      setGoogleConnected(false);
      alert('Google Agenda desconectado.');
    } catch (err) {
      alert('Erro ao desconectar.');
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`).toISOString();

      await api.post('/interviews', {
        jobId: formData.jobId,
        candidateId: formData.candidateId,
        startDateTime,
        endDateTime
      });

      alert('Entrevista agendada com sucesso!');
      setShowScheduleModal(false);
      loadData();
    } catch (err) {
      alert('Erro ao agendar entrevista. Certifique-se de que o Google Calendar está conectado.');
    }
  };

  const upcomingInterviews = interviews.filter(i => new Date(i.date) >= new Date(new Date().setHours(0,0,0,0)));
  const pastInterviews = interviews.filter(i => new Date(i.date) < new Date(new Date().setHours(0,0,0,0)));

  const displayList = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="w-8 h-8 text-primary" />
            Agenda de Entrevistas
          </h2>
          <p className="text-muted-foreground mt-1">
            Acompanhe e gerencie as entrevistas agendadas com seus candidatos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {googleConnected ? (
            <div className="flex flex-col items-end">
              <Button onClick={handleDisconnectGoogle} variant="outline" className="rounded-full shadow-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                <CalendarIcon className="w-4 h-4 mr-2" /> Desconectar Google
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnectGoogle} className="rounded-full shadow-sm bg-blue-600 hover:bg-blue-700">
              <CalendarIcon className="w-4 h-4 mr-2" /> Conectar Google Agenda
            </Button>
          )}
          <Button onClick={() => setShowScheduleModal(true)} disabled={!googleConnected} className="rounded-full shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Agendar
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Video className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Integração Automática com Google Meet</h4>
          <p className="text-sm text-blue-800 mt-1">
            Toda nova entrevista agendada gera automaticamente um link único do Google Meet e dispara convites sincronizados diretamente para a <strong>sua agenda corporativa</strong> e para a <strong>agenda do candidato</strong>.
          </p>
        </div>
      </div>

      <div className="flex border-b border-border/60">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'upcoming' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximas Entrevistas ({upcomingInterviews.length})
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'past' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('past')}
        >
          Histórico ({pastInterviews.length})
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-12 text-center text-gray-500 animate-pulse">Carregando entrevistas...</div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-border/40">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma entrevista encontrada</h3>
            <p className="text-muted-foreground">Você ainda não tem entrevistas {activeTab === 'upcoming' ? 'agendadas' : 'no histórico'}.</p>
          </div>
        ) : (
          displayList.map((interview) => (
            <Card key={interview.id} className="overflow-hidden border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Date Column */}
                <div className="bg-gray-50/80 p-6 md:w-64 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-center">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {new Date(interview.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{interview.time} <span className="text-sm text-gray-400 font-normal ml-1">BRT</span></div>
                  <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-600">
                    {interview.meetLink ? <Video className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {interview.meetLink ? 'Videochamada' : 'Presencial'}
                  </div>
                </div>
                
                {/* Info Column */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shadow-sm ring-2 ring-white">
                        {interview.candidate?.firstName?.[0] || 'C'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {interview.candidate?.firstName} {interview.candidate?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{interview.job?.title}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    {interview.status === 'scheduled' ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" /> Agendada
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4" /> {interview.status}
                      </div>
                    )}

                    {interview.meetLink && (
                      <a href={interview.meetLink} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        Entrar na Sala <Video className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Agendar Nova Entrevista</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vaga</label>
                <select required value={formData.jobId} onChange={e => setFormData({...formData, jobId: e.target.value})} className="w-full border rounded-md p-2">
                  <option value="">Selecione uma vaga...</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Candidato</label>
                <select required value={formData.candidateId} onChange={e => setFormData({...formData, candidateId: e.target.value})} className="w-full border rounded-md p-2">
                  <option value="">Selecione um candidato...</option>
                  {candidates.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-md p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Início</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full border rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Fim</label>
                  <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full border rounded-md p-2" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancelar</Button>
                <Button type="submit">Confirmar e Enviar Convite</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
