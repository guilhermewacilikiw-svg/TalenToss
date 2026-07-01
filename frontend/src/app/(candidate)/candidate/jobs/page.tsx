"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CandidateJobsFeed() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      // Fetch open jobs
      const res = await api.get('/jobs');
      setJobs(res.data);

      // Fetch user's existing applications to prevent duplicate clicks
      const appsRes = await api.get('/candidates/applications');
      const appliedMap: Record<string, boolean> = {};
      
      const applications = Array.isArray(appsRes.data) ? appsRes.data : [];
      applications.forEach((app: any) => {
        appliedMap[app.jobId] = true;
      });
      setApplied(appliedMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await api.post(`/candidates/apply/${jobId}`);
      setApplied((prev) => ({ ...prev, [jobId]: true }));
    } catch (err) {
      console.error('Failed to apply', err);
      alert('Erro ao aplicar. Certifique-se de ter feito upload do currículo primeiro!');
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando vagas compatíveis...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Feed de Vagas</h1>
        <p className="text-muted-foreground">
          Descubra oportunidades alinhadas com o seu perfil. Nossa IA conectará você com as empresas certas.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          Nenhuma vaga aberta no momento. Volte mais tarde!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-sm">
                      <Building2 className="w-4 h-4" />
                      {job.company?.name || 'Empresa Confidencial'}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                    Novo
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements?.slice(0, 3).map((req: string, i: number) => (
                    <span key={i} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                      {req}
                    </span>
                  ))}
                  {job.requirements?.length > 3 && (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                      +{job.requirements.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t mt-auto">
                {applied[job.id] ? (
                  <Button variant="secondary" className="w-full text-green-600 bg-green-500/10 hover:bg-green-500/20" disabled>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aplicação Enviada
                  </Button>
                ) : (
                  <Button 
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? 'Analisando perfil...' : 'Aplicar para esta vaga'}
                    {!applying && <ChevronRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
