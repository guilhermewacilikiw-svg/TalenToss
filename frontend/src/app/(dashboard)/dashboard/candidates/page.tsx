"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, User, FileText, MapPin, Phone, DollarSign, Laptop, Link as LinkIcon, Globe, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function CandidatesBankPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await api.get('/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter(c => 
    c.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    c.lastName?.toLowerCase().includes(search.toLowerCase()) || 
    c.headline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banco de Talentos</h2>
          <p className="text-muted-foreground">Busque profissionais disponíveis na plataforma.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar por nome ou cargo..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground animate-pulse">
            Carregando talentos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-lg border">
            Nenhum talento encontrado.
          </div>
        ) : (
          filtered.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {candidate.firstName?.[0] || <User />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <CardTitle className="truncate text-lg">
                    {candidate.firstName} {candidate.lastName}
                  </CardTitle>
                  <CardDescription className="truncate mt-1 text-primary/80 font-medium">
                    {candidate.headline || 'Buscando Oportunidades'}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {candidate.summary || 'Sem resumo disponível.'}
                </p>

              </CardContent>
              <div className="p-4 border-t mt-auto">
                <Link href={`/dashboard/candidates/${candidate.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Perfil Completo
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
