"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");

  function gerarEmail(usuario: string) {
    return `${usuario}@empresa.com`;
  }

  async function handleCadastro() {
    const email = gerarEmail(usuario);

    // 1️⃣ cria login no Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

     if (error) {
     console.log("ERRO COMPLETO:", error);
     alert(error.message);
     return;
     }

    // 2️⃣ salva dados na tabela
    await supabase.from("usuarios").insert({
      nome,
      sobrenome,
      usuario,
      email,
      cargo,
    });

    alert("Usuário criado com sucesso!");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Cadastro de Usuário
        </h1>

        <input placeholder="Nome" className="w-full p-3 mb-3 bg-zinc-800 rounded"
          onChange={(e) => setNome(e.target.value)} />

        <input placeholder="Sobrenome" className="w-full p-3 mb-3 bg-zinc-800 rounded"
          onChange={(e) => setSobrenome(e.target.value)} />

        <input placeholder="Usuário" className="w-full p-3 mb-3 bg-zinc-800 rounded"
          onChange={(e) => setUsuario(e.target.value)} />

        <input placeholder="Cargo" className="w-full p-3 mb-3 bg-zinc-800 rounded"
          onChange={(e) => setCargo(e.target.value)} />

        <input type="password" placeholder="Senha" className="w-full p-3 mb-6 bg-zinc-800 rounded"
          onChange={(e) => setSenha(e.target.value)} />

        <button
          onClick={handleCadastro}
          className="w-full bg-green-600 p-3 rounded font-bold"
        >
          Criar usuário
        </button>
      </div>
    </main>
  );
}
