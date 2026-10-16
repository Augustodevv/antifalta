'use client';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  async function login() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/agenda` } });
    setMsg(error ? error.message : 'Link enviado! Confira seu e-mail.');
  }
  return (
    <main>
      <h1>Entrar</h1>
      <input placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={login}>Receber link</button>
      <p>{msg}</p>
    </main>
  );
}
