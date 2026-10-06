import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ImagePlus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { nomeDoUsuario } from "@/lib/imoveis";
import { Image } from "@/components/ui/image";

const campo = "w-full h-12 rounded-xl bg-[#0F172A] border border-white/10 px-4 outline-none focus:border-[#10B981]";
const VAZIO = { titulo: "", tipo: "Comprar", preco: "", bairro: "", cidade: "", quartos: 1, banheiros: 1, vagas: 0, pet: false, descricao: "" };

function Campo({ label, children, className = "" }) {
  return <label className={`block ${className}`}><span className="text-xs text-slate-400 mb-1.5 block">{label}</span>{children}</label>;
}

export default function ListingForm() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [f, setF] = useState(VAZIO);
  const [fotos, setFotos] = useState([]);
  const [subindo, setSubindo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const subir = async (e) => {
    const arquivos = Array.from(e.target.files).slice(0, 6 - fotos.length);
    setSubindo(true);
    const urls = [];
    for (const file of arquivos) urls.push((await base44.integrations.Core.UploadPublicFile({ file })).file_url);
    setFotos((o) => [...o, ...urls]);
    setSubindo(false);
    e.target.value = "";
  };

  const publicar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    await base44.entities.Imovel.create({
      ...f, preco: Number(f.preco), quartos: Number(f.quartos), banheiros: Number(f.banheiros), vagas: Number(f.vagas),
      fotos, whatsapp: user.whatsapp, anunciante_nome: nomeDoUsuario(user),
    });
    await qc.invalidateQueries();
    setF(VAZIO); setFotos([]); setSalvando(false);
  };

  return (
    <form onSubmit={publicar} className="rounded-3xl bg-[#1E293B] border border-white/10 p-5 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-4">
      <h2 className="col-span-full font-heading font-bold text-xl">Novo anúncio</h2>
      <Campo label="Título" className="col-span-2 md:col-span-3"><input required className={campo} value={f.titulo} onChange={set("titulo")} /></Campo>
      <Campo label="Negócio"><select className={campo} value={f.tipo} onChange={set("tipo")}><option>Comprar</option><option>Alugar</option></select></Campo>
      <Campo label="Preço (R$)"><input required type="number" min="0" className={campo} value={f.preco} onChange={set("preco")} /></Campo>
      <Campo label="Bairro"><input className={campo} value={f.bairro} onChange={set("bairro")} /></Campo>
      <Campo label="Cidade"><input required className={campo} value={f.cidade} onChange={set("cidade")} /></Campo>
      <Campo label="Quartos"><input type="number" min="0" className={campo} value={f.quartos} onChange={set("quartos")} /></Campo>
      <Campo label="Banheiros"><input type="number" min="0" className={campo} value={f.banheiros} onChange={set("banheiros")} /></Campo>
      <Campo label="Vagas"><input type="number" min="0" className={campo} value={f.vagas} onChange={set("vagas")} /></Campo>
      <label className="flex items-center gap-2 self-end h-12"><input type="checkbox" checked={f.pet} onChange={set("pet")} className="w-5 h-5 accent-[#10B981]" />Aceita pet</label>
      <Campo label="Descrição" className="col-span-full"><textarea required className={`${campo} h-28 py-3`} value={f.descricao} onChange={set("descricao")} /></Campo>
      <div className="col-span-full">
        <span className="text-xs text-slate-400 mb-1.5 block">Fotos (até 6)</span>
        <div className="flex flex-wrap gap-3">
          {fotos.map((u) => (
            <div key={u} className="relative w-24 h-24 rounded-xl overflow-hidden">
              <Image src={u} alt="Foto do anúncio" className="w-full h-full" />
              <button type="button" onClick={() => setFotos(fotos.filter((x) => x !== u))} aria-label="Remover foto" className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 grid place-items-center"><X className="w-3 h-3" /></button>
            </div>
          ))}
          {fotos.length < 6 && (
            <label className="w-24 h-24 rounded-xl border border-dashed border-white/20 grid place-items-center cursor-pointer hover:border-[#10B981]">
              {subindo ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-6 h-6 text-slate-400" />}
              <input type="file" accept="image/*" multiple className="hidden" onChange={subir} disabled={subindo} />
            </label>
          )}
        </div>
      </div>
      <button disabled={salvando || subindo || fotos.length === 0} className="col-span-full min-h-[52px] rounded-xl bg-[#10B981] text-[#0F172A] font-bold disabled:opacity-40 flex items-center justify-center gap-2">
        {salvando && <Loader2 className="w-4 h-4 animate-spin" />}Publicar anúncio
      </button>
    </form>
  );
}