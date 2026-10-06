import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Carousel({ fotos, alt }) {
  const [i, setI] = useState(0);
  const prev = () => setI((i - 1 + fotos.length) % fotos.length);
  const next = () => setI((i + 1) % fotos.length);
  const btn = "absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0F172A]/70 backdrop-blur grid place-items-center hover:bg-[#10B981] hover:text-[#0F172A] transition";
  return (
    <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[480px] bg-[#1E293B]">
      <Image src={fotos[i]} alt={alt} className="w-full h-full" />
      <button onClick={prev} aria-label="Anterior" className={`${btn} left-4`}><ChevronLeft /></button>
      <button onClick={next} aria-label="Próximo" className={`${btn} right-4`}><ChevronRight /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {fotos.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Foto ${k + 1}`} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-[#34D399]" : "w-2 bg-white/60"}`} />
        ))}
      </div>
    </div>
  );
}