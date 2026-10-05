import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BedDouble, Bath, Car, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatarPreco, localDe } from "@/lib/imoveis";

export default function PropertyCard({ p, index, logado }) {
  const navigate = useNavigate();
  const abrir = () => {
    const destino = `/detalhes?id=${p.id}`;
    navigate(logado ? destino : `/login?returnTo=${encodeURIComponent(destino)}`);
  };
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.06, duration: 0.5 }}
      onClick={abrir}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-[#1E293B] border border-white/5 hover:border-[#10B981] hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-black/20"
    >
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <Image src={p.fotos?.[0]} alt={p.titulo} className="w-full h-full group-hover:scale-105 transition duration-500" />
        <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#0F172A]/70 backdrop-blur text-[#34D399]">{p.tipo === "Alugar" ? "Aluguel" : "Venda"}</span>
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-[#10B981] text-[#0F172A] font-bold font-heading">{formatarPreco(p)}</div>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-heading font-bold text-lg sm:text-xl tracking-tight truncate">{p.titulo}</h3>
        <p className="flex items-center gap-1 text-slate-400 text-sm mt-1"><MapPin className="w-4 h-4 shrink-0" /><span className="truncate">{localDe(p)}</span></p>
        <div className="flex gap-4 mt-4 text-slate-300 text-sm">
          <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-[#34D399]" />{p.quartos}</span>
          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#34D399]" />{p.banheiros}</span>
          <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-[#34D399]" />{p.vagas}</span>
        </div>
      </div>
    </motion.article>
  );
}