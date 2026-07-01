const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- Iniciando Testes de Fluxo TalenToss ---');
  
  try {
    // 1. Company Registration & Login
    const companyEmail = `empresa_${Date.now()}@test.com`;
    console.log(`\n1. Registrando empresa: ${companyEmail}`);
    await axios.post(`${API_URL}/auth/register`, {
      email: companyEmail,
      password: 'password123',
      role: 'COMPANY'
    });
    
    const companyLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: companyEmail,
      password: 'password123'
    });
    const companyToken = companyLoginRes.data.access_token;
    console.log('✅ Empresa registrada e logada. Token recebido.');

    // 2. Complete Company Profile
    console.log('\n2. Criando perfil da empresa');
    await axios.post(`${API_URL}/companies`, {
      name: 'Tech Corp',
      description: 'A great tech company'
    }, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    console.log('✅ Perfil da empresa criado.');

    // 3. Create Job
    console.log('\n3. Criando uma vaga');
    const jobRes = await axios.post(`${API_URL}/jobs`, {
      title: 'Desenvolvedor Frontend',
      description: 'Vaga para React e Next.js',
      requirements: ['React', 'Next.js', 'TypeScript']
    }, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    const jobId = jobRes.data.id;
    console.log(`✅ Vaga criada. ID: ${jobId}`);

    // 4. Candidate Registration & Login
    const candidateEmail = `candidato_${Date.now()}@test.com`;
    console.log(`\n4. Registrando candidato: ${candidateEmail}`);
    await axios.post(`${API_URL}/auth/register`, {
      email: candidateEmail,
      password: 'password123',
      role: 'CANDIDATE'
    });
    
    const candidateLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: candidateEmail,
      password: 'password123'
    });
    const candidateToken = candidateLoginRes.data.access_token;
    console.log('✅ Candidato registrado e logado. Token recebido.');

    // 5. Upload Resume
    console.log('\n5. Fazendo upload de currículo (mock PDF)');
    const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
    const validPdfStr = `%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%EOF`;
    fs.writeFileSync(dummyPdfPath, validPdfStr);
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(dummyPdfPath));
    await axios.post(`${API_URL}/candidates/upload-resume`, formData, {
      headers: { 
        ...formData.getHeaders(),
        Authorization: `Bearer ${candidateToken}` 
      }
    });
    fs.unlinkSync(dummyPdfPath);
    console.log('✅ Currículo enviado.');

    // 6. Apply to Job
    console.log('\n6. Aplicando para a vaga');
    await axios.post(`${API_URL}/candidates/apply/${jobId}`, {}, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    console.log('✅ Aplicação enviada com sucesso.');

    // 7. Check Applications (Company side)
    console.log('\n7. Empresa verifica aplicações da vaga');
    const appsRes = await axios.get(`${API_URL}/jobs/${jobId}/applications`, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    console.log(`✅ Encontradas ${appsRes.data.length} aplicações para a vaga.`);
    
    // 8. Update Application Status
    const appId = appsRes.data[0].id;
    console.log(`\n8. Empresa atualiza status da aplicação (${appId}) para SCREENING`);
    await axios.patch(`${API_URL}/jobs/applications/${appId}/status`, {
      status: 'SCREENING'
    }, {
      headers: { Authorization: `Bearer ${companyToken}` }
    });
    console.log('✅ Status atualizado.');

    // 9. Candidate checks applications
    console.log('\n9. Candidato verifica suas aplicações');
    const candidateApps = await axios.get(`${API_URL}/candidates/applications`, {
      headers: { Authorization: `Bearer ${candidateToken}` }
    });
    console.log(`✅ Candidato tem ${candidateApps.data.length} aplicação, status: ${candidateApps.data[0].status}`);
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🎉');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

runTests();
