"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Building2, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get('/candidates/applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCREENING': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'Aguardando Avaliação';
      case 'SCREENING': return 'Aprovado para Entrevista';
      case 'INTERVIEW': return 'Em Entrevista';
      case 'OFFER': return 'Proposta Recebida';
      case 'REJECTED': return 'Não Aprovado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCREENING': return 'bg-success/10 text-success border-success/20';
      case 'REJECTED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground animate-pulse">Carregando suas candidaturas...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Candidaturas</h1>
        <p className="text-muted-foreground">Acompanhe o status dos processos seletivos que você está participando.</p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center bg-muted/30">
          <p className="text-muted-foreground mb-4">Você ainda não se candidatou a nenhuma vaga.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {app.job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        {app.job.company.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Aplicado em {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-primary">Match:</span> {app.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="font-medium">{getStatusText(app.status)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
