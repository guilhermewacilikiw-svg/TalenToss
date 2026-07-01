"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, FileText, MapPin, Phone, DollarSign, Laptop, Link as LinkIcon, Globe, GraduationCap, Briefcase, ArrowLeft } from 'lucide-react';
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
      <div className="py-12 text-center text-muted-foreground animate-pulse">
        Carregando perfil...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="py-12 text-center text-muted-foreground bg-card rounded-lg border">
        Candidato não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>
      
      <Card className="rounded-2xl border-0 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-primary w-full"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md shrink-0">
              <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-primary text-3xl font-bold">
                {candidate.firstName?.[0] || <User className="w-10 h-10" />}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="text-lg font-medium text-primary mt-1">
                {candidate.headline || 'Buscando Oportunidades'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
            {/* Lado Esquerdo: Info Básica */}
            <div className="col-span-1 space-y-8 md:border-r md:pr-6">
              
              {/* Contatos e Informações Básicas */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{candidate.location || 'Localização não informada'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{candidate.phone || 'Telefone não informado'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{candidate.salaryExpectation || 'A Combinar'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Laptop className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{candidate.workModel || 'Flexível'}</span>
                </div>
                {candidate.linkedinUrl && (
                  <a href={candidate.linkedinUrl.startsWith('http') ? candidate.linkedinUrl : `https://${candidate.linkedinUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-blue-600 hover:underline">
                    <LinkIcon className="w-4 h-4 shrink-0" /> <span className="truncate">LinkedIn</span>
                  </a>
                )}
                {candidate.githubUrl && (
                  <a href={candidate.githubUrl.startsWith('http') ? candidate.githubUrl : `https://${candidate.githubUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-800 hover:underline">
                    <Globe className="w-4 h-4 shrink-0" /> <span className="truncate">Portfólio / GitHub</span>
                  </a>
                )}
              </div>

              {/* Top Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Habilidades em Destaque</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lado Direito: Resumo, Formação, Experiência */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              
              {/* Resumo Profissional */}
              <div>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Resumo Profissional
                </h4>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.summary || 'Nenhum resumo disponível.'}</p>
                </div>
              </div>

              {/* Formação Acadêmica */}
              {candidate.education && candidate.education.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    Formação Acadêmica
                  </h4>
                  <div className="space-y-3">
                    {candidate.education.map((edu: any, i: number) => (
                      <div key={i} className="bg-white border rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 text-sm">{edu.course || edu.degree} {edu.field ? `- ${edu.field}` : ''}</h5>
                        <p className="text-xs font-medium text-gray-600 mt-1">{edu.institution} • {edu.startDate || edu.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cursos */}
              {candidate.courses && candidate.courses.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-gray-400" />
                    Cursos e Especializações
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {candidate.courses.map((course: any, i: number) => (
                      <div key={i} className="bg-white border rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 text-sm">{course.name}</h5>
                        <p className="text-xs font-medium text-gray-600 mt-1">{course.institution} {course.hours ? `• ${course.hours}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiências */}
              {candidate.experiences && candidate.experiences.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    Experiência Profissional
                  </h4>
                  <div className="space-y-6">
                    {candidate.experiences.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                        <h5 className="font-bold text-gray-900 text-sm">{exp.position || exp.title}</h5>
                        <p className="text-xs font-medium text-primary mb-1">{exp.company} • {exp.startDate || exp.period} {exp.endDate && exp.endDate !== exp.startDate ? `até ${exp.endDate}` : ''}</p>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <Button 
                  className="w-full" 
                  disabled={!candidate.resumeUrl}
                  onClick={() => {
                    const baseUrl = api.defaults.baseURL || 'http://localhost:3000';
                    window.open(`${baseUrl}${candidate.resumeUrl}`, '_blank');
                  }}
                >
                   {candidate.resumeUrl ? 'Baixar Currículo em PDF' : 'PDF Original Indisponível'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
