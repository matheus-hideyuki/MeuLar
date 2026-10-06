import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Lock, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Header from "@/components/imoveis/Header";
import PropertyCard from "@/components/imoveis/PropertyCard";
import FilterBar, { FILTROS_VAZIOS } from "@/components/imoveis/FilterBar";

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function montarQuery(f, busca) {
  const q = {};
  if (f.tipo !== "todos") q.tipo = f.tipo;
  if (f.cidade !== "todos") q.cidade = f.cidade;
  if (f.quartos !== "todos") q.quartos = { $gte: Number(f.quartos) };
  if (f.banheiros !== "todos") q.banheiros = { $gte: Number(f.banheiros) };
  if (f.vagas !== "todos") q.vagas = { $gte: Number(f.vagas) };
  if (f.preco !== "todos") q.preco = { $lte: Number(f.preco) };
  if (f.pet === "sim") q.pet = true;
  if (busca.trim()) {
    const r = { $regex: escapar(busca.trim()), $options: "i" };
    q.$or = [{ titulo: r }, { bairro: r }, { cidade: r }, { descricao: r }];
  }
  return q;
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [f, setF] = useState(FILTROS_VAZIOS);
  const [busca, setBusca] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setBusca(f.busca), 400);
    return () => clearTimeout(t);
  }, [f.busca]);

  const query = isAuthenticated ? montarQuery(f, busca) : {};
  const tamanho = isAuthenticated ? 9 : 6;

  const lista = useInfiniteQuery({
    queryKey: ["imoveis", JSON.stringify(query), tamanho],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => base44.entities.Imovel.filter(query, { sort: "-created_date", limit: tamanho, cursor: pageParam }),
    getNextPageParam: (p) => (isAuthenticated && p.has_more ? p.next_cursor : undefined),
  });
  const total = useQuery({ queryKey: ["imoveis-total", JSON.stringify(query)], queryFn: () => base44.entities.Imovel.count(query), enabled: isAuthenticated });
  const cidades = useQuery({
    queryKey: ["cidades"], enabled: isAuthenticated,
    queryFn: async () => (await base44.entities.Imovel.filter({}, { distinct: "cidade" })).items.filter(Boolean).sort(),
  });
  const itens = lista.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-5">
        <header className="pt-10 sm:pt-16 pb-8 text-center">
          <h1 className="font-heading font-extrabold tracking-[-0.04em] text-3xl sm:text-5xl lg:text-6xl leading-tight">
            Encontre sua nova <span className="text-[#34D399]">história.</span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Compre ou alugue imóveis selecionados em todo o Brasil.</p>
          <div className="mt-8 max-w-5xl mx-auto">
            {isAuthenticated ? (
              <FilterBar f={f} setF={setF} cidades={cidades.data ?? []} />
            ) : (
              <div className="rounded-3xl bg-[#1E293B] border border-white/10 p-6 flex flex-col sm:flex-row items-center gap-4 justify-between text-left">
                <div className="flex items-center gap-3"><Lock className="w-6 h-6 text-[#34D399] shrink-0" />
                  <p className="text-slate-300">Entre ou cadastre-se para pesquisar, filtrar e abrir os detalhes de cada imóvel.</p></div>
                <div className="flex gap-2 shrink-0">
                  <Link to="/login" className="min-h-[48px] px-5 grid place-items-center rounded-xl border border-[#10B981] text-[#34D399] font-semibold">Entrar</Link>
                  <Link to="/register" className="min-h-[48px] px-5 grid place-items-center rounded-xl bg-[#10B981] text-[#0F172A] font-semibold">Cadastrar</Link>
                </div>
              </div>
            )}
          </div>
        </header>
        {isAuthenticated && total.data !== undefined && <p className="text-sm text-slate-400 mb-4">{total.data} {total.data === 1 ? "imóvel encontrado" : "imóveis encontrados"}</p>}
        {lista.isLoading ? (
          <div className="py-20 grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-[#34D399]" /></div>
        ) : (
          <section className="grid gap-6 sm:gap-8 pb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itens.map((p, i) => <PropertyCard key={p.id} p={p} index={i} logado={isAuthenticated} />)}
            {itens.length === 0 && <p className="col-span-full text-center text-slate-400 py-20">Nenhum imóvel encontrado com esses filtros.</p>}
          </section>
        )}
        {lista.hasNextPage && (
          <div className="text-center pb-16">
            <button onClick={() => lista.fetchNextPage()} disabled={lista.isFetchingNextPage} className="min-h-[48px] px-8 rounded-xl bg-[#1E293B] border border-white/10 hover:border-[#10B981] transition">
              {lista.isFetchingNextPage ? "Carregando..." : "Ver mais imóveis"}
            </button>
          </div>
        )}
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500">© 2026 Meu Lar Imóveis</footer>
    </div>
  );
}