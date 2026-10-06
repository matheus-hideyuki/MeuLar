import React, { useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function BecomeAdvertiser() {
  const { checkUserAuth } = useAuth();
  const [whats, setWhats] = useState("");
  const [loading, setLoading] = useState(false);
  const valido = whats.replace(/\D/g, "").length >= 10;

  const salvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.auth.updateMe({ tipo_conta: "anunciante", whatsapp: whats.replace(/\D/g, "") });
    await checkUserAuth();
    setLoading(false);
  };

  return (
    <form onSubmit={salvar} className="max-w-lg mx-auto rounded-3xl bg-[#1E293B] border border-white/10 p-6 sm:p-8 text-center">
      <Megaphone className="w-10 h-10 text-[#34D399] mx-auto" />
      <h1 className="font-heading font-bold text-2xl mt-4">Torne-se anunciante</h1>
      <p className="text-slate-400 mt-2 text-sm">Informe seu WhatsApp. Interessados vão falar direto com você.</p>
      <input value={whats} onChange={(e) => setWhats(e.target.value)} inputMode="tel" placeholder="(11) 99999-9999" className="w-full mt-6 h-12 rounded-xl bg-[#0F172A] border border-white/10 px-4 outline-none focus:border-[#10B981]" />
      <button disabled={!valido || loading} className="w-full min-h-[48px] mt-4 rounded-xl bg-[#10B981] text-[#0F172A] font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}Ativar conta de anunciante
      </button>
    </form>
  );
}