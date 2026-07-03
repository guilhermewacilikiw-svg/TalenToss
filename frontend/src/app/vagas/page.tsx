"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Search, MapPin, Briefcase, Building2, Calendar, DollarSign, Gift, ArrowRight, Info, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedModel, setSelectedModel] = useState('Todos');

  // Selected Job Details
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      // Only show open jobs
      const openJobs = res.data.filter((j: any) => j.status === 'OPEN');
      setJobs(openJobs);
      setFilteredJobs(openJobs);
    } catch (err) {
      console.error('Erro ao buscar vagas públicas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run filtering logic
  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(j => 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDept !== 'Todos') {
      result = result.filter(j => j.description.includes(`Área: ${selectedDept}`));
    }

    if (selectedModel !== 'Todos') {
      result = result.filter(j => j.description.includes(`Modelo: ${selectedModel}`));
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedDept, selectedModel, jobs]);

  // Extract metadata from Gupy-style description
  const parseDescription = (desc: string) => {
    const lines = desc.split('\n');
    let area = 'Geral';
    let level = 'Pleno';
    let model = 'Remoto';
    let contract = 'CLT';
    let salary = 'A combinar';
    let benefits = 'Vale Refeição, Plano de Saúde';
    let pureDesc = desc;

    lines.forEach(line => {
      if (line.includes('📍 Área:')) area = line.replace('📍 Área:', '').trim();
      if (line.includes('🏷️ Cargo/Nível:')) level = line.replace('🏷️ Cargo/Nível:', '').trim();
      if (line.includes('💻 Modelo:')) model = line.replace('💻 Modelo:', '').trim();
      if (line.includes('💼 Contrato:')) contract = line.replace('💼 Contrato:', '').trim();
      if (line.includes('💰 Salário:')) salary = line.replace('💰 Salário:', '').trim();
      if (line.includes('🎁 Benefícios:')) benefits = line.replace('🎁 Benefícios:', '').trim();
    });

    const descStartIndex = desc.indexOf('📝 DESCRIÇÃO DA VAGA');
    if (descStartIndex !== -1) {
      pureDesc = desc.substring(descStartIndex + 20).trim();
    }

    return { area, level, model, contract, salary, benefits, pureDesc };
  };

  const handleApplyClick = (jobId: string) => {
    // Save application target and redirect to login page
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `/candidate/dashboard?applyJobId=${jobId}`;
    } else {
      window.location.href = `/login?redirect=/candidate/dashboard?applyJobId=${jobId}`;
    }
  };

  // Get departments available
  const departments = ['Todos', ...Array.from(new Set(jobs.map(j => {
    const meta = parseDescription(j.description);
    return meta.area;
  }).filter(Boolean)))];

  // Get models available
  const models = ['Todos', 'Remoto', 'Híbrido', 'Presencial'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100/90 sticky top-0 z-50 shadow-sm/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Logo width={160} height={45} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-900 font-bold text-xs uppercase tracking-wider">
                Área da Empresa
              </Button>
            </Link>
            <Link href="/login?redirect=/candidate/dashboard">
              <Button className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-6 font-bold text-xs uppercase tracking-wider border-0 shadow-sm h-10">
                Portal do Candidato
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl text-center space-y-6">
          <span className="premium-badge bg-green-50 text-green-700 border border-green-100 px-3.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest inline-block">
            Portal de Carreiras
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Trabalhe Conosco
          </h1>
          <p className="text-gray-500 font-medium max-w-lg mx-auto text-sm leading-relaxed">
            Encontre sua próxima oportunidade de carreira. Nosso processo seletivo é otimizado por inteligência artificial para conectar você ao seu cargo ideal.
          </p>

          {/* Search bar & simple filters */}
          <div className="max-w-3xl mx-auto pt-6">
            <div className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar vagas por cargo, tecnologia..." 
                  className="w-full h-10 outline-none text-sm placeholder:text-gray-400 font-medium bg-transparent"
                />
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <select 
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="h-10 px-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600 outline-none"
                >
                  <option value="Todos">Todas as Áreas</option>
                  {departments.filter(d => d !== 'Todos').map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>

                <select 
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="h-10 px-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600 outline-none"
                >
                  <option value="Todos">Todos os Modelos</option>
                  {models.filter(m => m !== 'Todos').map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List Section */}
      <main className="container mx-auto px-6 py-12 max-w-5xl flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-gray-400 font-medium">
            Nenhuma vaga encontrada para os filtros aplicados.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const meta = parseDescription(job.description);
              return (
                <div 
                  key={job.id} 
                  className="p-6 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job);
                    setIsDetailOpen(true);
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-gray-900 group-hover:text-primary transition-colors text-base md:text-lg">
                        {job.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                        {meta.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company?.name || 'TalenToss Client'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {meta.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {meta.model}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {meta.contract}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <Button variant="ghost" className="rounded-full px-4 text-xs font-bold text-primary group-hover:bg-primary/5 transition-colors">
                      Ver detalhes
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center text-xs font-medium text-gray-400 mt-auto">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo width={135} height={38} />
          <p>
            &copy; {new Date().getFullYear()} TalenToss Portal de Carreiras. Sistema de Atração Inteligente de Talentos.
          </p>
        </div>
      </footer>

      {/* Job Details Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-[600px] flex flex-col h-screen p-0">
          {selectedJob && (() => {
            const meta = parseDescription(selectedJob.description);
            return (
              <>
                <div className="p-6 border-b bg-gray-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {meta.model}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {meta.contract}
                    </span>
                  </div>
                  <SheetTitle className="text-xl font-extrabold text-gray-900 leading-tight">
                    {selectedJob.title}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-gray-500 font-semibold mt-1">
                    {selectedJob.company?.name || 'TalenToss Client'} &bull; {meta.area} &bull; {meta.level}
                  </SheetDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Job Specs Matrix */}
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Remuneração</span>
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" />
                        {meta.salary}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Área / Departamento</span>
                      <span className="text-xs font-bold text-gray-700 block">
                        {meta.area}
                      </span>
                    </div>
                    <div className="col-span-2 space-y-1 pt-2 border-t border-gray-200/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Benefícios</span>
                      <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-blue-600" />
                        {meta.benefits}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Tags */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Requisitos & Qualificações</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.requirements?.map((req: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 border text-gray-600 text-xs font-semibold rounded-md">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pure Description text */}
                  <div className="space-y-2.5 border-t pt-4">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Descrição Detalhada</h4>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {meta.pureDesc}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t bg-white">
                  <Button 
                    onClick={() => handleApplyClick(selectedJob.id)} 
                    className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 h-11 rounded-xl font-bold shadow-sm border-0 flex items-center justify-center gap-2"
                  >
                    Candidatar-se para esta vaga
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

    </div>
  );
}
