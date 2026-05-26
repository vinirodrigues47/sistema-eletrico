"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const email = data.session.user.email;

      if (email) {
        setUsuario(email.split("@")[0]);
      }
    }

    checkUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      
      {/* MENU LATERAL */}
      <aside className="w-64 bg-zinc-900 p-6">
        <h2 className="text-xl font-bold mb-10">
          Sistema
        </h2>

        <nav className="flex flex-col gap-4">
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/clientes">Clientes</a>
          <a href="/dashboard/orcamentos">Orçamentos</a>
        </nav>

        <div className="mt-10">
          <p className="mb-2">Olá, {usuario}</p>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}