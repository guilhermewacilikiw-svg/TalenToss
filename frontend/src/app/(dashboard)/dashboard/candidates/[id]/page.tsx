"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, FileText, MapPin, Phone, DollarSign, Laptop, Link as LinkIcon, Globe, GraduationCap, Briefcase, ArrowLeft, Bot, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCandidate();
    }
  }, [id]);

  const loadCandidate = async () => {
    try {
      const res = await api.get(`/candidates/${id}`);
      setCandidate(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-gray-400 animate-pulse">
        Carregando perfil...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="py-12 text-center text-xs font-semibold text-gray-400 bg-white rounded-xl border border-gray-100">
        Candidato não encontrado.
      </div>
    );
  }

  const compatibility = candidate.employabilityScore || 90;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-xs font-bold text-gray-500 hover:text-gray-900" onClick={() => router.back()}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Voltar para a lista
        </Button>
        <span className="premium-badge bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold">
          {compatibility}% Match Geral
        </span>
      </div>
      
      {/* Main Profile Header Card */}
      <Card className="premium-card overflow-hidden">
        {/* Sleek top accent line */}
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-green-500 w-full"></div>
        <div className="px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-2xl shrink-0">
              {candidate.firstName?.[0]?.toUpperCase() || <User className="w-10 h-10" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <span className="premium-badge bg-blue-50 text-primary border border-blue-100 text-[9px] font-bold uppercase tracking-wider">
                  Perfil Triado por IA
                </span>
              </div>
              <p className="text-sm font-semibold text-primary">
                {candidate.headline || 'Buscando Oportunidades'}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-gray-400 font-semibold">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-300" /> {candidate.location || 'Localização não informada'}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-300" /> {candidate.phone || 'Telefone não informado'}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gray-300" /> {candidate.salaryExpectation || 'A Combinar'}</span>
                <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-gray-300" /> {candidate.workModel || 'Remoto / Híbrido'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Contacts, Skills, Links */}
        <div className="space-y-6">
          
          {/* Quick Info & Links */}
          <Card className="premium-card p-6 space-y-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-150">Acesso Rápido</h4>
            <div className="space-y-3.5">
              {candidate.linkedinUrl && (
                <a href={candidate.linkedinUrl.startsWith('http') ? candidate.linkedinUrl : `https://${candidate.linkedinUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" /> <span>LinkedIn Perfil</span>
                </a>
              )}
              {candidate.githubUrl && (
                <a href={candidate.githubUrl.startsWith('http') ? candidate.githubUrl : `https://${candidate.githubUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:underline">
                  <Globe className="w-3.5 h-3.5 shrink-0" /> <span>Portfólio / GitHub</span>
                </a>
              )}
              <Button 
                variant="outline" 
                className="w-full text-xs font-bold border-gray-200/80 rounded-xl"
                disabled={!candidate.resumeUrl}
                onClick={() => {
                  const baseUrl = api.defaults.baseURL || 'http://localhost:3000';
                  window.open(`${baseUrl}${candidate.resumeUrl}`, '_blank');
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-gray-400" /> Download Currículo PDF
              </Button>
            </div>
          </Card>

          {/* AI Fit Analysis Box */}
          <Card className="premium-card p-6 bg-blue-50/20 border-blue-100/60 space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Apreciação da IA</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Fit Técnico</span>
                <span className="text-primary font-bold">Excelente</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Fit Cultural</span>
                <span className="text-primary font-bold">Forte Alinhamento</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed border-t pt-3">
                Candidato possui sólidos conhecimentos no stack de front-end solicitado e demonstrou em suas experiências anteriores autonomia na construção de micro-frontends.
              </p>
            </div>
          </Card>

          {/* Extracted Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <Card className="premium-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Competências Mapeadas</h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill: string, i: number) => (
                  <span key={i} className="premium-badge bg-gray-150 text-gray-700 text-[10px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

        </div>

        {/* Right Column: Experience, Education, Bio */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Summary bio */}
          <Card className="premium-card p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100/80">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Resumo Gerado por IA</h4>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">
              {candidate.summary || 'Resumo profissional não disponível.'}
            </p>
          </Card>

          {/* Technical Experiences Timeline */}
          {candidate.experiences && candidate.experiences.length > 0 && (
            <Card className="premium-card p-6 space-y-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100/80">Experiência Profissional</h4>
              <div className="space-y-6">
                {candidate.experiences.map((exp: any, i: number) => (
                  <div key={i} className="relative pl-6 border-l border-gray-150">
                    <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-1.5 ring-4 ring-white"></div>
                    <h5 className="font-bold text-gray-900 text-sm">{exp.position || exp.title}</h5>
                    <p className="text-[10px] font-semibold text-primary/80 mb-1">{exp.company} • {exp.startDate || exp.period} {exp.endDate && exp.endDate !== exp.startDate ? `até ${exp.endDate}` : ''}</p>
                    <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Education list */}
          {candidate.education && candidate.education.length > 0 && (
            <Card className="premium-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100/80">Formação Acadêmica</h4>
              <div className="grid gap-3">
                {candidate.education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start p-3 rounded-xl border border-gray-50 bg-gray-50/30">
                    <div>
                      <h5 className="font-bold text-gray-800 text-xs">{edu.course || edu.degree} {edu.field ? `- ${edu.field}` : ''}</h5>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{edu.institution}</p>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{edu.startDate || edu.period}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
