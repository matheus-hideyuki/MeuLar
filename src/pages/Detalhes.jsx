import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BedDouble, Bath, Car, PawPrint, MapPin, MessageCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Header from "@/components/imoveis/Header";
import Carousel from "@/components/imoveis/Carousel";
import ReviewForum from "@/components/imoveis/ReviewForum";
import { formatarPreco, localDe, whatsLink } from "@/lib/imoveis";

export default function Detalhes() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { data: p, isLoading } = useQuery({ queryKey: ["imovel", id], queryFn: () => base44.entities.Imovel.get(id), retry: false, enabled: !!id });

  if (isLoading) {
    return <div className="min-h-screen bg-[#0F172A] grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-[#34D399]" /></div>;
  }
  if (!p) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white"><Header />
        <div className="text-center py-32"><p className="mb-6 text-slate-400">Imóvel não encontrado.</p>
          <Link to="/" className="px-6 py-3 rounded-xl bg-[#10B981] text-[#0F172A] font-semibold">Voltar à lista</Link></div>
      </div>
    );
  }

  const specs = [
    { Icon: BedDouble, label: "Quartos", v: p.quartos },
    { Icon: Bath, label: "Banheiros", v: p.banheiros },
    { Icon: Car, label: "Vagas", v: p.vagas },
  ];
  const interesse = whatsLink(p.whatsapp, `Olá! Tenho interesse no imóvel "${p.titulo}" (${localDe(p)}) anunciado no Meu Lar Imóveis.`);
  const duvida = whatsLink(p.whatsapp, `Olá! Tenho uma dúvida sobre o imóvel "${p.titulo}" (${localDe(p)}).`);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <Link to="/" className="inline-flex items-center gap-2 min-h-[48px] text-slate-300 hover:text-[#34D399] transition"><ArrowLeft className="w-5 h-5" />Voltar</Link>
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-10 mt-2">
          <div className="lg:col-start-1"><Carousel fotos={p.fotos?.length ? p.fotos : []} alt={p.titulo} /></div>
          <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28 self-start rounded-3xl bg-[#1E293B] border border-white/5 p-6 sm:p-7 shadow-2xl shadow-black/30">
            <h1 className="font-heading font-extrabold tracking-tight text-2xl sm:text-3xl break-words">{p.titulo}</h1>
            <p className="flex items-center gap-1 text-slate-400 mt-2"><MapPin className="w-4 h-4 shrink-0" />{localDe(p)}</p>
            <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[#10B981] mt-5">{formatarPreco(p)}</p>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {specs.map(({ Icon, label, v }) => (
                <div key={label} className="rounded-2xl bg-[#0F172A] p-3 sm:p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto text-[#34D399]" />
                  <p className="font-bold text-lg mt-1">{v}</p><p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            {p.pet && <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#10B981]/15 text-[#34D399] text-sm font-medium"><PawPrint className="w-4 h-4" />Aceita Pet</span>}
            {p.anunciante_nome && <p className="text-sm text-slate-400 mt-4">Anunciante: <span className="text-white">{p.anunciante_nome}</span></p>}
            <a href={interesse} target="_blank" rel="noreferrer" className="w-full min-h-[52px] mt-6 rounded-xl bg-[#10B981] text-[#0F172A] font-bold hover:bg-[#34D399] transition flex items-center justify-center">
              {p.tipo === "Alugar" ? "Tenho Interesse" : "Tenho Interesse / Comprar"}
            </a>
            <a href={duvida} target="_blank" rel="noreferrer" className="w-full min-h-[52px] mt-3 rounded-xl border border-[#10B981] text-[#34D399] font-semibold flex items-center justify-center gap-2 hover:bg-[#10B981]/10 transition">
              <MessageCircle className="w-5 h-5" />Falar no WhatsApp
            </a>
          </aside>
          <div className="lg:col-start-1 min-w-0">
            <h2 className="font-heading font-bold text-2xl tracking-tight mb-3">Descrição</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line break-words">{p.descricao}</p>
            <ReviewForum id={p.id} />
          </div>
        </div>
      </main>
    </div>
  );
}