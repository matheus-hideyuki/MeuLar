import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { nomeDoUsuario } from "@/lib/imoveis";

export function Stars({ value, size = "w-4 h-4" }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= value ? "fill-[#34D399] text-[#34D399]" : "text-slate-600"}`} />
      ))}
    </span>
  );
}

export default function ReviewForum({ id }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [nota, setNota] = useState(0);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["avaliacoes", id],
    queryFn: () => base44.entities.Avaliacao.filter({ imovel_id: id }, { sort: "-created_date", limit: 50 }),
  });
  const list = data?.items ?? [];

  const enviar = async (e) => {
    e.preventDefault();
    if (!nota || !texto.trim()) return;
    setEnviando(true);
    await base44.entities.Avaliacao.create({ imovel_id: id, nota, texto: texto.trim(), autor_nome: nomeDoUsuario(user) });
    await qc.invalidateQueries({ queryKey: ["avaliacoes", id] });
    setNota(0); setTexto(""); setEnviando(false);
  };

  return (
    <section className="mt-12">
      <h2 className="font-heading font-bold text-2xl tracking-tight mb-6">Fórum & Avaliações</h2>
      <form onSubmit={enviar} className="rounded-3xl bg-[#1E293B] border border-white/5 p-5 sm:p-6 space-y-4">
        <p className="text-sm text-slate-400">Comentando como <span className="text-white font-medium">{nomeDoUsuario(user)}</span></p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-400 text-sm">Sua nota:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setNota(n)} aria-label={`${n} estrelas`} className="p-1">
                <Star className={`w-7 h-7 transition ${n <= nota ? "fill-[#34D399] text-[#34D399]" : "text-slate-600 hover:text-[#34D399]"}`} />
              </button>
            ))}
          </div>
        </div>
        <textarea className="w-full min-h-[110px] rounded-xl bg-[#0F172A] border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#10B981]" placeholder="Escreva um comentário ou dúvida..." value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button disabled={!nota || !texto.trim() || enviando} className="min-h-[48px] px-8 rounded-xl bg-[#10B981] text-[#0F172A] font-semibold hover:bg-[#34D399] disabled:opacity-40 transition flex items-center gap-2">
          {enviando && <Loader2 className="w-4 h-4 animate-spin" />}Publicar
        </button>
      </form>
      <div className="mt-6 space-y-4">
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-[#34D399] mx-auto" />}
        {!isLoading && list.length === 0 && <p className="text-slate-500 text-center py-6">Seja o primeiro a comentar.</p>}
        {list.map((r) => (
          <div key={r.id} className="rounded-2xl bg-[#1E293B]/70 border border-white/5 p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#10B981] text-[#0F172A] font-bold grid place-items-center">{r.autor_nome?.[0]?.toUpperCase()}</span>
                <div><p className="font-semibold">{r.autor_nome}</p><p className="text-xs text-slate-500">{new Date(r.created_date).toLocaleDateString("pt-BR")}</p></div>
              </div>
              <Stars value={r.nota} />
            </div>
            <p className="mt-3 text-slate-300 break-words">{r.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}