"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [clientes, setClientes] = useState(0);

  useEffect(() => {
    async function carregarClientes() {
      const { data, error } = await supabase
        .from("clientes")
        .select("*");

      if (error) {
        console.log(error);
        return;
      }

      setClientes(data.length);
    }

    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Sistema Elétrico
        </h1>

        <p className="text-zinc-400 text-lg mb-6">
          Gestão de Orçamentos Profissionais
        </p>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400">
            Clientes cadastrados
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {clientes}
          </h2>
        </div>
      </div>
    </main>
  );
}