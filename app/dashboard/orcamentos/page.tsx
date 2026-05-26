"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Orcamentos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // 🔹 carregar clientes
  async function carregarClientes() {
    const { data } = await supabase.from("clientes").select("*");
    if (data) setClientes(data);
  }

  // 🔹 criar orçamento
  async function criarOrcamento() {
    await supabase.from("orcamentos").insert({
      cliente_id: clienteId,
      descricao,
      valor: Number(valor),
    });

    setDescricao("");
    setValor("");
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orçamentos</h1>

      {/* FORM */}
      <div className="flex flex-col gap-3 max-w-md">

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        />

        <input
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="p-2 bg-zinc-800 rounded"
        />

        <button
          onClick={criarOrcamento}
          className="bg-green-600 p-2 rounded"
        >
          Criar orçamento
        </button>

      </div>
    </div>
  );
}