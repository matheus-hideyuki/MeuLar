import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { formatarPreco, localDe } from "@/lib/imoveis";
import { Image } from "@/components/ui/image";

export default function MyListings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["meus-imoveis", user.id],
    queryFn: () => base44.entities.Imovel.filter({ created_by_id: user.id }, { sort: "-created_date", limit: 50 }),
  });
  const itens = data?.items ?? [];

  const remover = async (id) => {
    await base44.entities.Imovel.delete(id);
    await qc.invalidateQueries();
  };

  return (
    <section className="mt-10">
      <h2 className="font-heading font-bold text-xl mb-4">Meus anúncios ({itens.length})</h2>
      <div className="space-y-3">
        {itens.length === 0 && <p className="text-slate-500">Você ainda não publicou nenhum imóvel.</p>}
        {itens.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl bg-[#1E293B] border border-white/5 p-3">
            <Image src={p.fotos?.[0]} alt={p.titulo} className="w-20 h-20 rounded-xl shrink-0" />
            <Link to={`/detalhes?id=${p.id}`} className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.titulo}</p>
              <p className="text-sm text-slate-400 truncate">{localDe(p)}</p>
              <p className="text-sm text-[#34D399] font-semibold">{formatarPreco(p)}</p>
            </Link>
            <button onClick={() => remover(p.id)} aria-label="Excluir anúncio" className="w-11 h-11 rounded-xl hover:bg-red-500/20 text-red-400 grid place-items-center shrink-0"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </section>
  );
}