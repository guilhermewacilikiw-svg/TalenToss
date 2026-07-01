"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrainCircuit, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function JobMatchingPage({ params }: { params: { id: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatching = async () => {
      try {
        const res = await api.get(`/jobs/${params.id}/matching`);
        // O backend retorna um array com { id, firstName, lastName, headline, employabilityScore, match_score }
        setCandidates(res.data);
      } catch (err) {
        console.error('Erro ao buscar matching:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatching();
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Matching de Inteligência Artificial</h2>
          <p className="text-muted-foreground">Resultados ordenados por similaridade vetorial para a vaga #Engenheiro Sênior</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Headline (Extraído pela IA)</TableHead>
                <TableHead className="text-center">Score Empregabilidade</TableHead>
                <TableHead className="text-center">Compatibilidade (Match)</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold">{c.firstName} {c.lastName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.headline || 'N/A'}</TableCell>
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
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">Analisar Perfil</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
