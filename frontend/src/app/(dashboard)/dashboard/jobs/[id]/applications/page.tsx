"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadApplications();
    }
  }, [params.id]);

  const loadApplications = async () => {
    try {
      const res = await api.get(`/jobs/${params.id}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: 'SCREENING' | 'REJECTED') => {
    try {
      await api.patch(`/jobs/applications/${appId}/status`, { status });
      // Update local state to reflect change instantly
      setApplications(apps => 
        apps.map(a => a.id === appId ? { ...a, status } : a)
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/jobs')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Aplicações Recebidas</h2>
          <p className="text-muted-foreground">Candidatos que demonstraram interesse e se inscreveram nesta vaga.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Candidatos</CardTitle>
          <CardDescription>
            {applications.length} candidatos encontrados. Ordenados pelo Score de IA (Match).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Headline</TableHead>
                <TableHead className="text-center">Score da IA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground animate-pulse">
                    Buscando aplicações...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Nenhuma aplicação recebida ainda.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.candidate.firstName} {app.candidate.lastName}
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">{app.candidate.user.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {app.candidate.headline || 'Não informado'}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center font-bold text-lg text-primary">
                        {app.matchScore ?? '--'}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                        {app.status === 'APPLIED' ? 'Nova Inscrição' : app.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Button 
                        variant={app.status === 'SCREENING' ? 'default' : 'ghost'} 
                        size="icon" 
                        className={app.status === 'SCREENING' ? 'bg-success text-success-foreground hover:bg-success/90' : 'text-success hover:bg-success/10'}
                        onClick={() => handleUpdateStatus(app.id, 'SCREENING')}
                        title="Aprovar (Entrevista)"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant={app.status === 'REJECTED' ? 'default' : 'ghost'} 
                        size="icon" 
                        className={app.status === 'REJECTED' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'text-destructive hover:bg-destructive/10'}
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        title="Rejeitar"
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="sm">Ver Perfil Completo</Button>
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
