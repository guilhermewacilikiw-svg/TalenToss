const api = 'https://oslogui-talentoss.hf.space';

async function register() {
  const res = await fetch(`${api}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'empresa@talentoss.com',
      password: 'senhaforte123',
      name: 'TalenToss RH',
      role: 'COMPANY'
    })
  });
  console.log(await res.text());
}
register();
