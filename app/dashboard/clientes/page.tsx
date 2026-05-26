"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Clientes() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);

  // 🔹 CARREGAR CLIENTES
  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*");

    if (error) {
      console.log("Erro ao buscar clientes:", error);
      return;
    }

    if (data) setClientes(data);
  }

  // 🔹 CRIAR CLIENTE
  async function criarCliente() {
    const { error } = await supabase.from("clientes").insert({
      nome,
      telefone,
      email,
    });

    if (error) {
      console.log("Erro ao criar cliente:", error);
      return;
    }

    setNome("");
    setTelefone("");
    setEmail("");

    carregarClientes();
  }

  // 🔹 DELETAR CLIENTE
  async function deletarCliente(id: string) {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Erro ao deletar:", error);
      return;
    }

    carregarClientes();
  }

  useEffect(() => {
    carregarClientes();
  }, []);
   function formatarTelefone(telefone: string) {
   const numeros = telefone.replace(/\D/g, "");

   if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
   }

   return telefone;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      {/* FORMULÁRIO */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        />

        <button
          onClick={criarCliente}
          className="bg-green-600 px-4 rounded"
        >
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div>
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-zinc-800 p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p><strong>{cliente.nome}</strong></p>
              <p>{formatarTelefone(cliente.telefone)}</p>
              <p>{cliente.email}</p>
            </div>

            <button
              onClick={() => deletarCliente(cliente.id)}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}