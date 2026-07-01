"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle2, Bot, Briefcase, FileText, Clock, Star, Sparkles, Edit2, MapPin, Phone, Link as LinkIcon, DollarSign, Laptop, Globe, GraduationCap, Save } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function CandidateDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [profileData, setProfileData] = useState<any>({ 
    firstName: '', lastName: '', headline: '', summary: '', 
    phone: '', location: '', linkedinUrl: '', githubUrl: '', 
    salaryExpectation: '', workModel: '',
    experiences: [], education: [], skills: [] 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Mock Stats
  const stats = { jobs: 12, applications: 3, interviews: 1 };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/candidates/profile');
      if (res.data) {
        setProfileData({
          ...res.data,
          experiences: res.data.experiences || [],
          education: res.data.education || [],
          skills: res.data.skills || []
        });
        setIsDone(true);
      }
    } catch (err) {
      // Nenhum perfil ainda
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/candidates/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData({
        ...res.data,
        experiences: res.data.experiences || [],
        education: res.data.education || [],
        skills: res.data.skills || []
      });
      setIsDone(true);
      setFile(null);
    } catch (err: any) {
      console.error('Erro ao fazer upload do currículo:', err);
      setErrorMsg('Falha ao processar o currículo. Verifique se você está logado.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/candidates/profile', profileData);
      setProfileData(res.data);
      setIsEditing(false);
      setIsDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Olá, {profileData.firstName || 'Candidato'}! <span className="text-2xl">👋</span></h2>
          <p className="text-gray-500 mt-1 font-medium">Aqui está o resumo da sua carreira hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/candidate/jobs">
            <Button className="bg-primary text-white rounded-full px-6 font-medium shadow-sm hover:bg-primary/90">
              <Briefcase className="w-4 h-4 mr-2" /> Buscar Vagas
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Score do Perfil</p>
              <h3 className="text-3xl font-bold text-gray-900">{isDone ? profileData?.employabilityScore || 85 : 0}%</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">{isDone ? 'Perfil otimizado pela IA' : 'Envie seu currículo'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Vagas Recomendadas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.jobs}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">+5 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Candidaturas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.applications}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">Em andamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Entrevistas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.interviews}</h3>
              <p className="text-xs font-medium text-gray-500 mt-2">Agendadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lado Esquerdo: Upload ou Perfil Completo */}
        <Card className="rounded-2xl border-0 shadow-sm flex flex-col h-full col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-xl font-bold">Seu Perfil Profissional</CardTitle>
            {isDone && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil Completo
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-6">
            
            {(!isDone || isEditing) ? (
              <div className="space-y-6">
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 mb-6">
                  <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Bot className="w-4 h-4" /> Preenchimento Mágico com IA
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Faça upload do seu currículo em PDF e a IA preencherá as experiências, educação, contatos e criará um resumo otimizado para você!
                  </p>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="resume-upload" 
                  />
                  <div className="flex items-center gap-3">
                    <label htmlFor="resume-upload">
                      <Button variant="outline" className="bg-white" type="button" onClick={() => document.getElementById('resume-upload')?.click()}>
                        <UploadCloud className="w-4 h-4 mr-2" /> Selecionar PDF
                      </Button>
                    </label>
                    {file && (
                      <Button onClick={handleUpload} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isUploading ? 'Analisando...' : 'Preencher com IA'}
                      </Button>
                    )}
                  </div>
                  {file && <p className="text-xs text-blue-600 mt-2">{file.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nome</label>
                    <Input placeholder="Ex: João" value={profileData.firstName || ''} onChange={e => setProfileData({...profileData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Sobrenome</label>
                    <Input placeholder="Ex: Silva" value={profileData.lastName || ''} onChange={e => setProfileData({...profileData, lastName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefone</label>
                    <Input placeholder="Ex: (11) 99999-9999" value={profileData.phone || ''} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Localização</label>
                    <Input placeholder="Ex: São Paulo, SP" value={profileData.location || ''} onChange={e => setProfileData({...profileData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                    <Input placeholder="https://linkedin.com/in/..." value={profileData.linkedinUrl || ''} onChange={e => setProfileData({...profileData, linkedinUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">GitHub / Portfólio URL</label>
                    <Input placeholder="https://github.com/..." value={profileData.githubUrl || ''} onChange={e => setProfileData({...profileData, githubUrl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Pretensão Salarial</label>
                    <Input placeholder="Ex: R$ 8.000 PJ" value={profileData.salaryExpectation || ''} onChange={e => setProfileData({...profileData, salaryExpectation: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Modelo de Trabalho Preferido</label>
                    <Input placeholder="Remoto, Híbrido ou Presencial" value={profileData.workModel || ''} onChange={e => setProfileData({...profileData, workModel: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Headline Profissional (O que você faz?)</label>
                  <Input 
                    placeholder="Ex: Desenvolvedor Full Stack Sênior especializado em React e Node" 
                    value={profileData.headline || ''} 
                    onChange={e => setProfileData({...profileData, headline: e.target.value})}
                    className="h-auto p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Resumo Profissional / Bio</label>
                  <textarea 
                    placeholder="Fale um pouco sobre sua experiência..." 
                    value={profileData.summary || ''}
                    onChange={e => setProfileData({...profileData, summary: e.target.value})}
                    className="flex min-h-[120px] w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Habilidades (Skills) - Separe por vírgulas</label>
                  <Input 
                    placeholder="React, Next.js, Node, SQL..." 
                    value={(profileData.skills || []).join(', ')}
                    onChange={e => setProfileData({...profileData, skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})} 
                    className="h-auto p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-primary/50"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Experiências (Extraídas pela IA)</label>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {profileData.experiences?.length > 0 ? profileData.experiences.map((exp: any, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                        <div className="font-bold text-gray-900">{exp.position || exp.title}</div>
                        <div className="text-xs text-primary font-medium mb-1.5">{exp.company} • {exp.startDate || exp.period} - {exp.endDate}</div>
                        <div className="text-gray-600 text-xs leading-relaxed">{exp.description}</div>
                      </div>
                    )) : (
                      <div className="p-4 bg-gray-50 border rounded-lg text-center text-sm text-gray-500">
                        Nenhuma experiência registrada. Faça o upload do seu currículo.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Formação Acadêmica</label>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {profileData.education?.length > 0 ? profileData.education.map((edu: any, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                        <div className="font-bold text-gray-900">{edu.course || edu.degree} {edu.field ? `- ${edu.field}` : ''}</div>
                        <div className="text-xs text-gray-600 mt-1">{edu.institution} • {edu.startDate || edu.period} - {edu.endDate}</div>
                      </div>
                    )) : (
                      <div className="p-4 bg-gray-50 border rounded-lg text-center text-sm text-gray-500">
                        Nenhuma formação registrada.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Cursos e Especializações</label>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {profileData.courses?.length > 0 ? profileData.courses.map((course: any, i: number) => (
                      <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg text-sm">
                        <div className="font-bold text-gray-900">{course.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{course.institution} {course.hours ? `• ${course.hours}` : ''}</div>
                      </div>
                    )) : (
                      <div className="p-4 bg-gray-50 border rounded-lg text-center text-sm text-gray-500">
                        Nenhum curso registrado.
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">A edição destas sessões é feita enviando um novo currículo em PDF.</p>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3">
                  {isDone && (
                    <Button variant="outline" onClick={() => { setIsEditing(false); loadProfile(); }}>Cancelar Edição</Button>
                  )}
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white min-w-[200px]">
                    <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Salvando...' : 'Salvar Perfil Completo'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Esquerda: Info Básica */}
                <div className="col-span-1 space-y-6 border-r pr-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{profileData?.firstName} {profileData?.lastName}</h3>
                    <p className="text-primary font-medium mt-1">{profileData?.headline || 'Headline não definida'}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-3 text-gray-400" /> {profileData?.location || 'Localização não informada'}</div>
                    <div className="flex items-center text-sm text-gray-600"><Phone className="w-4 h-4 mr-3 text-gray-400" /> {profileData?.phone || 'Telefone não informado'}</div>
                    <div className="flex items-center text-sm text-gray-600"><DollarSign className="w-4 h-4 mr-3 text-gray-400" /> {profileData?.salaryExpectation || 'A Combinar'}</div>
                    <div className="flex items-center text-sm text-gray-600"><Laptop className="w-4 h-4 mr-3 text-gray-400" /> {profileData?.workModel || 'Flexível'}</div>
                  </div>
                  
                  <div className="pt-4 border-t flex flex-col gap-2">
                    {profileData?.linkedinUrl && (
                      <a href={profileData.linkedinUrl.startsWith('http') ? profileData.linkedinUrl : `https://${profileData.linkedinUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                        <LinkIcon className="w-4 h-4 mr-2" /> LinkedIn
                      </a>
                    )}
                    {profileData?.githubUrl && (
                      <a href={profileData.githubUrl.startsWith('http') ? profileData.githubUrl : `https://${profileData.githubUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-gray-800 hover:underline">
                        <Globe className="w-4 h-4 mr-2" /> GitHub / Portfólio
                      </a>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData?.skills?.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {(!profileData?.skills || profileData.skills.length === 0) && (
                        <span className="text-sm text-gray-500">Nenhuma skill listada</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direita: Resumo e Linha do Tempo */}
                <div className="col-span-1 md:col-span-2 space-y-8">
                  <section>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center"><Bot className="w-5 h-5 mr-2 text-primary" /> Bio (Resumo da IA)</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {profileData?.summary || 'Nenhum resumo gerado.'}
                    </p>
                  </section>
                  
                  {profileData?.education && profileData.education.length > 0 && (
                    <section>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><GraduationCap className="w-5 h-5 mr-2 text-primary" /> Formação Acadêmica</h4>
                      <div className="space-y-4">
                        {profileData.education.map((edu: any, i: number) => (
                          <div key={i} className="bg-white border rounded-xl p-4">
                            <h5 className="font-bold text-gray-900">{edu.course || edu.degree} {edu.field ? `- ${edu.field}` : ''}</h5>
                            <p className="text-sm font-medium text-gray-600">{edu.institution} • {edu.startDate || edu.period}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {profileData?.courses && profileData.courses.length > 0 && (
                    <section>
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-primary" /> Cursos e Especializações</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profileData.courses.map((course: any, i: number) => (
                          <div key={i} className="bg-white border rounded-xl p-4">
                            <h5 className="font-bold text-gray-900 text-sm">{course.name}</h5>
                            <p className="text-xs font-medium text-gray-600 mt-1">{course.institution} {course.hours ? `• ${course.hours}` : ''}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  <section>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-primary" /> Experiência Profissional</h4>
                    <div className="space-y-6">
                      {profileData?.experiences?.map((exp: any, i: number) => (
                        <div key={i} className="relative pl-6 border-l-2 border-gray-200">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                          <h5 className="font-bold text-gray-900">{exp.position || exp.title}</h5>
                          <p className="text-sm font-medium text-primary mb-1">{exp.company} • {exp.startDate || exp.period} {exp.endDate && exp.endDate !== exp.startDate ? `até ${exp.endDate}` : ''}</p>
                          <p className="text-sm text-gray-600">{exp.description}</p>
                        </div>
                      ))}
                      {(!profileData?.experiences || profileData.experiences.length === 0) && (
                        <p className="text-sm text-gray-500">Faça o upload do seu currículo para extrairmos suas experiências.</p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>

        {/* Status das Candidaturas (Semelhante ao Funil) */}
        <Card className="rounded-2xl border-0 shadow-sm flex flex-col col-span-1 lg:col-span-2 max-w-4xl mx-auto w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Progresso das Candidaturas</CardTitle>
            <Link href="/candidate/applications">
              <Button variant="link" className="text-primary font-medium text-sm p-0">Ver todas</Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center py-8">
            <div className="space-y-4 px-4">
              {[
                { label: 'Aplicações Enviadas', count: 12, color: 'bg-blue-600', w: '100%' },
                { label: 'Em Análise (Triagem)', count: 5, color: 'bg-blue-400', w: '60%' },
                { label: 'Aprovado para Entrevista', count: 1, color: 'bg-emerald-400', w: '20%' },
                { label: 'Propostas Recebidas', count: 0, color: 'bg-emerald-600', w: '5%' },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between gap-8">
                  <div className="flex-1 flex justify-center">
                    <div 
                      className={`h-10 ${step.color} rounded-sm flex items-center justify-center transition-all opacity-90`}
                      style={{ width: step.w }}
                    >
                      <span className="text-white text-xs font-semibold px-2 truncate">{step.label}</span>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <p className="text-xs font-medium text-gray-500">{step.label}</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">{step.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
