"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Building2, MapPin, Briefcase, ChevronRight, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PublicCareersPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;
  
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      loadPublicProfile();
    }
  }, [companyId]);

  const loadPublicProfile = async () => {
    try {
      const res = await api.get(`/companies/${companyId}/public`);
      setCompany(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (jobId: string) => {
    // Save intended job to localStorage to auto-apply after login/register
    localStorage.setItem("intended_job_apply", jobId);
    router.push("/login?role=CANDIDATE&redirect=apply");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center animate-pulse text-muted-foreground">Carregando portal de vagas...</div>;
  }

  if (!company) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Empresa não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Section */}
      <div className="bg-white border-b pt-16 pb-12 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 bg-slate-100 rounded-xl border flex items-center justify-center overflow-hidden shrink-0">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-slate-300" />
            )}
          </div>
          <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{company.name}</h1>
            <p className="text-lg text-slate-600 mb-4 max-w-2xl">{company.description || "Venha fazer parte do nosso time!"}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Visitar Website &rarr;
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Vagas Abertas ({company.jobs?.length || 0})</h2>
        </div>

        {(!company.jobs || company.jobs.length === 0) ? (
          <div className="bg-white border rounded-xl p-12 text-center text-muted-foreground shadow-sm">
            Não há vagas abertas no momento. Acompanhe nossas redes para futuras oportunidades!
          </div>
        ) : (
          <div className="grid gap-4">
            {company.jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow group border-slate-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Tempo Integral</div>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                    </div>
                    
                    <div className="shrink-0 flex flex-col md:items-end gap-3 justify-center border-t pt-4 md:border-0 md:pt-0">
                       <Button onClick={() => handleApplyClick(job.id)} size="lg" className="w-full md:w-auto font-bold shadow-sm">
                         Candidatar-se <ChevronRight className="w-4 h-4 ml-1" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
