"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { api } from '@/lib/api';
import { Star, Loader2, Briefcase, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MatchesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Star className="w-8 h-8 text-primary fill-primary/20" />
          Central de Matches
        </h2>
        <p className="text-muted-foreground mt-1">
          A Inteligência Artificial do TalenToss cruza os dados das suas vagas ativas com toda a nossa base de candidatos em tempo real.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="text-center py-12 border-0 shadow-sm rounded-2xl">
          <CardContent>
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nenhuma vaga ativa</h3>
            <p className="text-muted-foreground mb-6">Crie uma vaga para que a IA comece a buscar os melhores talentos.</p>
            <Link href="/dashboard/jobs">
              <Button>Ir para Vagas</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden border-0 shadow-sm rounded-2xl group transition-all hover:shadow-md">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-white/60 hover:bg-white/80 text-primary border border-primary/20 transition-colors">
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 max-w-2xl">{job.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button variant="default" className="rounded-full shadow-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Recomendações
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
