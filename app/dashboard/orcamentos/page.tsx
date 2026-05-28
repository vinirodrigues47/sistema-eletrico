"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Orcamentos() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<any>(null);
  const [itens, setItens] = useState<any[]>([]);
  const [descricaoItem, setDescricaoItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");

  // 🔹 carregar clientes
  async function carregarClientes() {
    const { data } = await supabase.from("clientes").select("*");
    if (data) setClientes(data);
  }

  // 🔹 carregar orçamentos
  async function carregarOrcamentos() {
    const { data } = await supabase
      .from("orcamentos")
      .select("*")
      .order("criado_em", { ascending: false });

    if (data) setOrcamentos(data);
  }

  // 🔹 criar orçamento
  async function criarOrcamento() {
    if (!clienteId || !descricao || !valor) {
      alert("Preencha todos os campos");
      return;
    }

    const { error } = await supabase.from("orcamentos").insert({
      client_id: clienteId,
      descricao,
      valor: Number(valor),
    });

    if (error) {
      console.log(error);
      alert("Erro ao salvar orçamento");
      return;
    }

    setClienteId("");
    setDescricao("");
    setValor("");

    carregarOrcamentos();
  }

  // 🔹 carregar itens
  async function carregarItens(orcamentoId: string) {
    const { data } = await supabase
      .from("itens_orcamento")
      .select("*")
      .eq("orcamento_id", orcamentoId);

    if (data) setItens(data);
  }

  // 🔹 criar item
  async function criarItem() {
    console.log("clicou no botão");

    if (!descricaoItem || !quantidade || !valorUnitario || !orcamentoSelecionado) {
      alert("Preencha tudo");
      return;
    }

    const { error } = await supabase.from("itens_orcamento").insert({
      orcamento_id: orcamentoSelecionado.id,
      descricao: descricaoItem,
      quantidade: Number(quantidade),
      valor_unitario: Number(valorUnitario),
    });

    if (error) {
      console.log("Erro ao criar item:", error);
      return;
    }

    setDescricaoItem("");
    setQuantidade("");
    setValorUnitario("");

    carregarItens(orcamentoSelecionado.id);
  }

  function getNomeCliente(id: string) {
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente";
  }

  function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  useEffect(() => {
    carregarClientes();
    carregarOrcamentos();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orçamentos</h1>

      {/* FORM */}
      <div className="flex flex-col gap-3 max-w-md mb-8">
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
          type="button"
          onClick={criarOrcamento}
          className="bg-green-600 p-2 rounded"
        >
          Criar orçamento
        </button>
      </div>

      {/* LISTA */}
      <div>
        {orcamentos.map((orc) => (
          <div
            key={orc.id}
            onClick={() => {
              setOrcamentoSelecionado(orc);
              carregarItens(orc.id);
            }}
            className="bg-zinc-800 p-4 mb-3 rounded cursor-pointer"
          >
            <p><strong>{getNomeCliente(orc.client_id)}</strong></p>
            <p>{orc.descricao}</p>
            <p className="text-green-400 font-bold">
              {formatarValor(orc.valor)}
            </p>
          </div>
        ))}
      </div>

      {/* ITENS */}
      {orcamentoSelecionado && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Itens</h2>

          <div className="flex flex-col gap-2 max-w-md mb-4">
            <input
              placeholder="Descrição do item"
              value={descricaoItem}
              onChange={(e) => setDescricaoItem(e.target.value)}
              className="p-2 bg-zinc-800 rounded"
            />

            <input
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="p-2 bg-zinc-800 rounded"
            />

            <input
              placeholder="Valor unitário"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
              className="p-2 bg-zinc-800 rounded"
            />

            <button
              type="button"
              onClick={criarItem}
              className="bg-blue-600 p-2 rounded"
            >
              Adicionar item
            </button>
          </div>

          {itens.map((item) => (
            <div key={item.id} className="bg-zinc-700 p-3 mb-2 rounded">
              <p>{item.descricao}</p>
              <p>
                {item.quantidade} x R$ {item.valor_unitario}
              </p>
              <p className="text-green-400 font-bold">
                Total: R$ {item.quantidade * item.valor_unitario}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}