"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  function gerarEmail(usuario: string) {
    return `${usuario}@empresa.com`;
  }

  async function handleLogin() {
    const email = gerarEmail(usuario);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
    alert("Usuário ou senha inválidos");
    console.log(error);
    return;
  }

router.push("/dashboard");

    alert("Login realizado com sucesso!");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="text"
          placeholder="Usuário"
          className="w-full p-3 mb-4 rounded bg-zinc-800"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-3 mb-6 rounded bg-zinc-800"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-3 rounded font-bold"
        >
          Entrar
        </button>
      </div>
    </main>
  );
}