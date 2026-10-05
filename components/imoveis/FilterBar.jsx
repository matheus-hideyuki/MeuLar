import React from "react";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRECOS = {
  Comprar: [500000, 1000000, 2000000, 3000000],
  Alugar: [2000, 4000, 8000, 12000],
};
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const mais = (n) => ({ v: String(n), l: `${n}+` });

export const FILTROS_VAZIOS = { busca: "", tipo: "todos", cidade: "todos", quartos: "todos", banheiros: "todos", vagas: "todos", preco: "todos", pet: "todos" };

function Combo({ label, value, onChange, options, disabled }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-400 mb-1.5 px-1">{label}</p>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-12 rounded-xl bg-[#0F172A] border-white/10 text-white focus:ring-[#10B981]"><SelectValue /></SelectTrigger>
        <SelectContent className="bg-[#1E293B] text-white border-white/10">
          {options.map((o) => (
            <SelectItem key={o.v} value={o.v} className="focus:bg-[#10B981] focus:text-[#0F172A]">{o.l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function FilterBar({ f, setF, cidades }) {
  const set = (k) => (v) => setF((o) => ({ ...o, [k]: v, ...(k === "tipo" ? { preco: "todos" } : {}) }));
  const todos = (l) => ({ v: "todos", l });
  const precos = PRECOS[f.tipo] || [];
  const sujo = JSON.stringify(f) !== JSON.stringify(FILTROS_VAZIOS);
  return (
    <div className="rounded-3xl bg-[#1E293B] border border-white/10 p-4 sm:p-5 shadow-2xl shadow-black/30 text-left">
      <div className="flex items-center gap-2 rounded-2xl bg-[#0F172A] border border-white/10 px-3 focus-within:border-[#10B981]">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input value={f.busca} onChange={(e) => set("busca")(e.target.value)} placeholder="Busque por nome, bairro, cidade ou característica..." className="flex-1 min-w-0 bg-transparent py-3.5 outline-none placeholder:text-slate-500" />
        {f.busca && <button onClick={() => set("busca")("")} aria-label="Limpar busca"><X className="w-4 h-4 text-slate-400" /></button>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mt-4">
        <Combo label="Negócio" value={f.tipo} onChange={set("tipo")} options={[todos("Todos"), { v: "Comprar", l: "Comprar" }, { v: "Alugar", l: "Alugar" }]} />
        <Combo label="Cidade" value={f.cidade} onChange={set("cidade")} options={[todos("Todas"), ...cidades.map((c) => ({ v: c, l: c }))]} />
        <Combo label="Quartos" value={f.quartos} onChange={set("quartos")} options={[todos("Qualquer"), ...[1, 2, 3, 4].map(mais)]} />
        <Combo label="Banheiros" value={f.banheiros} onChange={set("banheiros")} options={[todos("Qualquer"), ...[1, 2, 3].map(mais)]} />
        <Combo label="Vagas" value={f.vagas} onChange={set("vagas")} options={[todos("Qualquer"), ...[1, 2, 3].map(mais)]} />
        <Combo label="Preço máximo" value={f.preco} onChange={set("preco")} disabled={!precos.length}
          options={[todos(precos.length ? "Sem limite" : "Escolha o negócio"), ...precos.map((n) => ({ v: String(n), l: `até ${brl(n)}` }))]} />
        <Combo label="Pets" value={f.pet} onChange={set("pet")} options={[todos("Tanto faz"), { v: "sim", l: "Aceita pet" }]} />
      </div>
      {sujo && (
        <button onClick={() => setF(FILTROS_VAZIOS)} className="mt-4 text-sm text-[#34D399] hover:underline inline-flex items-center gap-1"><X className="w-4 h-4" />Limpar filtros</button>
      )}
    </div>
  );
}