const http = require('http');

const baseURL = 'http://localhost:3000';

async function fetchJSON(path, options = {}) {
  const url = `${baseURL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} at ${path}`);
  }
  return response.json();
}

async function runSweep() {
  try {
    console.log('1. Registrando Empresa...');
    const companyEmail = `empresa_${Date.now()}@test.com`;
    await fetchJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: companyEmail, password: '123', role: 'COMPANY', firstName: 'TechCorp' })
    });
    
    console.log('2. Logando Empresa...');
    const companyLogin = await fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: companyEmail, password: '123' })
    });
    const companyToken = companyLogin.access_token;
    
    console.log('3. Criando Vaga...');
    const jobRes = await fetchJSON('/jobs', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${companyToken}` },
      body: JSON.stringify({ title: 'Engenheiro de Software', description: 'Vaga top', requirements: ['Node.js', 'React'] })
    });
    const jobId = jobRes.id;
    
    console.log('4. Registrando Candidato...');
    const candEmail = `cand_${Date.now()}@test.com`;
    await fetchJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: candEmail, password: '123', role: 'CANDIDATE', firstName: 'João', lastName: 'Silva' })
    });
    
    console.log('5. Logando Candidato...');
    const candLogin = await fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: candEmail, password: '123' })
    });
    const candToken = candLogin.access_token;
    
    console.log('6. Atualizando Perfil do Candidato...');
    await fetchJSON('/candidates/profile', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${candToken}` },
      body: JSON.stringify({ headline: 'Dev Fullstack Node.js React', summary: 'Experiencia' })
    });

    console.log('7. Candidato aplicando para a Vaga...');
    await fetchJSON(`/candidates/apply/${jobId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${candToken}` }
    });

    console.log('8. Empresa listando aplicações...');
    const apps = await fetchJSON(`/jobs/${jobId}/applications`, {
      headers: { 'Authorization': `Bearer ${companyToken}` }
    });
    console.log(`Sucesso! Encontradas ${apps.length} aplicação(ões).`);
    
    console.log('✨ Varredura E2E concluída com sucesso!');
  } catch (error) {
    console.error('❌ Falha na varredura:', error.message);
  }
}

runSweep();
