"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle2, Bot, Briefcase, FileText, Clock, Star, Sparkles, Edit2, MapPin, Phone, Link as LinkIcon, DollarSign, Laptop, Globe, GraduationCap, Save, Loader2 } from 'lucide-react';
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
  
  // Dashboard stats
  const stats = { jobs: 0, applications: 0, interviews: 0 };

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
      // Profile not created yet
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
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 selection:bg-primary/10">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Olá, {profileData.firstName || 'Candidato'}! <span className="text-xl">👋</span>
          </h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Mantenha seu perfil atualizado para matches ideais
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/candidate/jobs">
            <Button className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Buscar Vagas
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Cards Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Score do Perfil', value: `${isDone ? (profileData?.employabilityScore || 85) : 0}%`, subtitle: isDone ? 'Otimizado por IA' : 'Envie seu currículo', icon: Star, color: 'text-blue-500 bg-blue-50/50' },
          { label: 'Candidaturas', value: stats.applications, subtitle: 'Acompanhar respostas', icon: FileText, color: 'text-purple-500 bg-purple-50/50' },
          { label: 'Entrevistas', value: stats.interviews, subtitle: 'Agendamentos oficiais', icon: Clock, color: 'text-amber-500 bg-amber-50/50' },
        ].map((item, idx) => (
          <Card key={idx} className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.value}</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Form Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Side: Dynamic Profile detail or editing */}
        <Card className="premium-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100/80">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-800">Seu Perfil Profissional</CardTitle>
              <CardDescription className="text-xs text-gray-400 font-medium">Informações extraídas do seu currículo e bio principal</CardDescription>
            </div>
            {isDone && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-xs font-bold rounded-xl border-gray-200">
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Editar
              </Button>
            )}
          </CardHeader>
          
          <CardContent className="pt-6">
            
            {(!isDone || isEditing) ? (
              <div className="space-y-6">
                
                {/* Magic PDF Uploader */}
                <div className="p-5 bg-blue-50/40 border border-blue-100/80 rounded-xl space-y-4">
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Preenchimento Mágico com IA</span>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Faça upload do currículo em formato PDF. Nossa inteligência artificial extrairá experiências e competências de forma estruturada.
                      </p>
                    </div>
                  </div>

                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="resume-upload" 
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="resume-upload">
                      <Button variant="outline" type="button" onClick={() => document.getElementById('resume-upload')?.click()} className="text-xs font-bold rounded-xl border-gray-200 bg-white">
                        <UploadCloud className="w-4 h-4 mr-1.5 text-gray-400" /> Selecionar PDF
                      </Button>
                    </label>
                    {file && (
                      <Button onClick={handleUpload} disabled={isUploading} className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-full px-5 py-2 border-0 shadow-sm">
                        {isUploading ? 'Processando...' : 'Preencher com IA'}
                      </Button>
                    )}
                  </div>
                  {file && <p className="text-xs font-bold text-primary mt-1">{file.name}</p>}
                  {errorMsg && <p className="text-xs font-bold text-destructive mt-1">{errorMsg}</p>}
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Nome', key: 'firstName', placeholder: 'Ex: João' },
                    { label: 'Sobrenome', key: 'lastName', placeholder: 'Ex: Silva' },
                    { label: 'Telefone', key: 'phone', placeholder: 'Ex: (11) 99999-9999' },
                    { label: 'Localização', key: 'location', placeholder: 'Ex: São Paulo, SP' },
                    { label: 'LinkedIn URL', key: 'linkedinUrl', placeholder: 'https://linkedin.com/in/...' },
                    { label: 'GitHub / Portfólio', key: 'githubUrl', placeholder: 'https://github.com/...' },
                    { label: 'Pretensão Salarial', key: 'salaryExpectation', placeholder: 'Ex: R$ 8.000 PJ' },
                    { label: 'Modelo de Trabalho', key: 'workModel', placeholder: 'Ex: Remoto' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700">{field.label}</Label>
                      <Input 
                        placeholder={field.placeholder} 
                        value={profileData[field.key] || ''} 
                        onChange={e => setProfileData({...profileData, [field.key]: e.target.value})} 
                        className="premium-input h-10 w-full"
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold text-gray-700">Título Profissional (Headline)</Label>
                    <Input 
                      placeholder="Ex: Desenvolvedor Front-end Sênior" 
                      value={profileData.headline || ''} 
                      onChange={e => setProfileData({...profileData, headline: e.target.value})} 
                      className="premium-input h-10 w-full"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold text-gray-700">Resumo da Carreira (Gerado pela IA)</Label>
                    <textarea 
                      placeholder="Fale um pouco sobre sua carreira..." 
                      value={profileData.summary || ''} 
                      onChange={e => setProfileData({...profileData, summary: e.target.value})} 
                      className="flex min-h-[100px] w-full rounded-lg border border-gray-200/80 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-[#111827] text-white hover:bg-[#111827]/90 text-xs font-bold rounded-full px-6 shadow-sm border-0 h-10">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1.5" />}
                    Salvar Perfil
                  </Button>
                  {isDone && (
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-500 h-10">
                      Cancelar
                    </Button>
                  )}
                </div>

              </div>
            ) : (
              // Read Only Profile Details view
              <div className="space-y-6">
                
                {profileData.headline && (
                  <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Headline</span>
                    <span className="text-sm font-bold text-gray-800">{profileData.headline}</span>
                  </div>
                )}

                {profileData.summary && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Resumo Curatorial</span>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed whitespace-pre-wrap">{profileData.summary}</p>
                  </div>
                )}

                {/* Experiences list */}
                {profileData.experiences && profileData.experiences.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Experiência Profissional</span>
                    <div className="space-y-4">
                      {profileData.experiences.map((exp: any, i: number) => (
                        <div key={i} className="relative pl-5 border-l border-gray-150">
                          <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-1.5 ring-4 ring-white"></div>
                          <h4 className="text-xs font-bold text-gray-900">{exp.position}</h4>
                          <p className="text-[9px] font-semibold text-primary/80">{exp.company} • {exp.period || exp.startDate}</p>
                          <p className="text-[11px] text-gray-400 font-medium mt-1.5 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
            
          </CardContent>
        </Card>

        {/* Right Side: Skill mapping & active resume indicator */}
        <div className="space-y-6">
          
          {/* Resume PDF Indicator */}
          {profileData.resumeUrl && (
            <Card className="premium-card p-6 space-y-4 bg-green-50/20 border-green-100/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Currículo Ativo</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Seu currículo foi analisado com sucesso e está visível para empresas premium no Banco de Talentos.
              </p>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs font-bold rounded-xl border-green-200 bg-white text-green-700 hover:bg-green-50/40"
                  onClick={() => {
                    const baseUrl = api.defaults.baseURL || 'http://localhost:3000';
                    window.open(`${baseUrl}${profileData.resumeUrl}`, '_blank');
                  }}
                >
                  <FileText className="w-3.5 h-3.5 mr-1" /> Ver PDF Original
                </Button>
              </div>
            </Card>
          )}

          {/* Extracted Skills List */}
          {profileData.skills && profileData.skills.length > 0 && (
            <Card className="premium-card p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Competências Mapeadas</h4>
              <div className="flex flex-wrap gap-1.5">
                {profileData.skills.map((skill: string, i: number) => (
                  <span key={i} className="premium-badge bg-gray-100 text-gray-600 text-[10px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
