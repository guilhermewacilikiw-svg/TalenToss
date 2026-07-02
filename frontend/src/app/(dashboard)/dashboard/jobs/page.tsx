"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Loader2, Briefcase, Plus, Calendar, AlertCircle, Bot, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Tecnologia / Engenharia',
    level: 'Pleno',
    workModel: 'Remoto',
    contractType: 'CLT',
    salaryRange: 'A combinar',
    description: '',
    requirements: '',
    benefits: 'Vale Refeição, Plano de Saúde, Auxílio Home Office'
  });

  useEffect(() => {
    loadJobs();
    if (searchParams.get('new') === 'true') {
      setIsSheetOpen(true);
    }
  }, [searchParams]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/jobs/my-jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const requirementsArray = formData.requirements.split(',').map(r => r.trim()).filter(Boolean);
      
      const compiledDescription = `
📍 Área: ${formData.department}
🏷️ Cargo/Nível: ${formData.level}
💻 Modelo: ${formData.workModel}
💼 Contrato: ${formData.contractType}
💰 Salário: ${formData.salaryRange}
🎁 Benefícios: ${formData.benefits}

---------------------------------------------
📝 DESCRIÇÃO DA VAGA
${formData.description}
`.trim();

      await api.post('/jobs', {
        title: formData.title,
        description: compiledDescription,
        requirements: requirementsArray,
        status: 'OPEN'
      });
      setIsSheetOpen(false);
      setFormData({
        title: '',
        department: 'Tecnologia / Engenharia',
        level: 'Pleno',
        workModel: 'Remoto',
        contractType: 'CLT',
        salaryRange: 'A combinar',
        description: '',
        requirements: '',
        benefits: 'Vale Refeição, Plano de Saúde, Auxílio Home Office'
      });
      loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWithAi = async () => {
    setIsAiGenerating(true);
    // Simulate high quality B2B AI job generation
    setTimeout(() => {
      setFormData({
        title: 'Desenvolvedor React / Node.js Pleno',
        department: 'Tecnologia / Engenharia',
        level: 'Pleno',
        workModel: 'Remoto',
        contractType: 'CLT',
        salaryRange: 'R$ 7.000,00 - R$ 9.500,00',
        description: 'Buscamos um desenvolvedor apaixonado por construir interfaces rápidas e escaláveis usando Next.js, TailwindCSS e integrando APIs REST/GraphQL escritas em Node.js com TypeScript.',
        requirements: 'React, Next.js, Node.js, TypeScript, REST API, TailwindCSS',
        benefits: 'Vale Refeição, Plano de Saúde Premium, Auxílio Home Office, Gympass'
      });
      setIsAiGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Vagas Publicadas</h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
            Gerencie o pipeline de vagas da sua organização
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger render={<Button className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-5 py-2 font-semibold text-xs tracking-wider uppercase shadow-sm border-0"><Plus className="w-3.5 h-3.5 mr-1.5" /> Criar Nova Vaga</Button>} />
          <SheetContent className="sm:max-w-[550px] flex flex-col h-screen p-0">
            <div className="p-6 border-b">
              <SheetTitle className="text-lg font-bold">Cadastrar Nova Vaga</SheetTitle>
              <SheetDescription className="text-xs text-gray-400 font-medium mt-1">
                Os detalhes inseridos servirão como base para o cruzamento de dados com IA.
              </SheetDescription>
            </div>
            
            <form onSubmit={handleCreateJob} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Magic IA Trigger Button */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary tracking-wide uppercase">Assistente de Escrita</span>
                    <span className="text-[9px] text-gray-500 font-medium">Gerar template de vaga automaticamente</span>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={generateWithAi} 
                  disabled={isAiGenerating}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-[10px] tracking-wider uppercase rounded-full h-8 px-4 border-0 shadow-sm shrink-0"
                >
                  {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Gerar com IA'}
                </Button>
              </div>

              {/* Título da Vaga */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold text-gray-700">Título da Vaga</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Ex: Engenheiro Front-end Sênior" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>

              {/* Grid 1: Departamento & Nível */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="department" className="text-xs font-bold text-gray-700">Área / Departamento</Label>
                  <select 
                    id="department"
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all font-medium text-gray-800"
                  >
                    <option value="Tecnologia / Engenharia">Tecnologia / Engenharia</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Vendas e Comercial">Vendas e Comercial</option>
                    <option value="Marketing e Comunicação">Marketing e Comunicação</option>
                    <option value="Financeiro e Administrativo">Financeiro e Administrativo</option>
                    <option value="Operações / Logística">Operações / Logística</option>
                    <option value="Atendimento / Suporte">Atendimento / Suporte</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="level" className="text-xs font-bold text-gray-700">Cargo / Nível</Label>
                  <select 
                    id="level"
                    value={formData.level} 
                    onChange={e => setFormData({...formData, level: e.target.value})}
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all font-medium text-gray-800"
                  >
                    <option value="Estágio">Estágio</option>
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Especialista">Especialista</option>
                    <option value="Liderança / Coordenação">Liderança / Coordenação</option>
                    <option value="Diretoria / Gerência">Diretoria / Gerência</option>
                  </select>
                </div>
              </div>

              {/* Grid 2: Modelo de Trabalho & Tipo de Contrato */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="workModel" className="text-xs font-bold text-gray-700">Modelo de Trabalho</Label>
                  <select 
                    id="workModel"
                    value={formData.workModel} 
                    onChange={e => setFormData({...formData, workModel: e.target.value})}
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all font-medium text-gray-800"
                  >
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contractType" className="text-xs font-bold text-gray-700">Tipo de Contrato</Label>
                  <select 
                    id="contractType"
                    value={formData.contractType} 
                    onChange={e => setFormData({...formData, contractType: e.target.value})}
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary transition-all font-medium text-gray-800"
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Estágio">Estágio</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
              </div>

              {/* Faixa Salarial */}
              <div className="space-y-1.5">
                <Label htmlFor="salaryRange" className="text-xs font-bold text-gray-700">Faixa Salarial / Remuneração</Label>
                <Input 
                  id="salaryRange" 
                  value={formData.salaryRange} 
                  onChange={e => setFormData({...formData, salaryRange: e.target.value})} 
                  placeholder="Ex: R$ 5.000,00 - R$ 7.000,00 (ou 'A combinar')" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>

              {/* Benefícios */}
              <div className="space-y-1.5">
                <Label htmlFor="benefits" className="text-xs font-bold text-gray-700">Benefícios da Vaga</Label>
                <Input 
                  id="benefits" 
                  value={formData.benefits} 
                  onChange={e => setFormData({...formData, benefits: e.target.value})} 
                  placeholder="Ex: Vale Refeição, Seguro de Vida, Plano de Saúde" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>
              
              {/* Descrição */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700">Descrição (Responsabilidades e Cultura)</Label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="flex min-h-[120px] w-full rounded-lg border border-gray-200/80 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-400 font-medium"
                  placeholder="Responsabilidades, atribuições e cultura..." 
                  required 
                />
              </div>

              {/* Requisitos */}
              <div className="space-y-1.5">
                <Label htmlFor="requirements" className="text-xs font-bold text-gray-700">Requisitos (separados por vírgula)</Label>
                <Input 
                  id="requirements" 
                  value={formData.requirements} 
                  onChange={e => setFormData({...formData, requirements: e.target.value})} 
                  placeholder="Ex: React, Node.js, TypeScript" 
                  required 
                  className="premium-input h-10 w-full"
                />
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#111827] text-white hover:bg-[#111827]/90 h-11 rounded-xl font-bold shadow-sm border-0">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publicar Vaga'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table Container */}
      <Card className="premium-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4 pl-6">Cargo</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Candidatos</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4">Criada Em</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-500 py-4 text-right pr-6">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs font-bold text-gray-400 animate-pulse">Carregando vagas...</TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs font-semibold text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-6 h-6 text-gray-300" />
                      <span>Nenhuma vaga ativa no momento.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} className="border-b border-gray-100/50 hover:bg-gray-50/30 transition-all">
                    <TableCell className="font-bold text-gray-800 py-4 pl-6">{job.title}</TableCell>
                    <TableCell className="py-4">
                      <span className="premium-badge bg-green-50 text-green-700 border border-green-100 text-[10px]">
                        Ativa
                      </span>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-gray-500 text-sm">
                      {Math.floor(Math.random() * 8) + 1} candidates
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-gray-400 text-xs">
                      {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 font-bold text-xs">
                        Ver Detalhes
                      </Button>
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

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-gray-400 animate-pulse">Carregando vagas...</div>}>
      <JobsContent />
    </Suspense>
  );
}
