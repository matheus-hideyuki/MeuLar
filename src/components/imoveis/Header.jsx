import React from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, Megaphone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { nomeDoUsuario } from "@/lib/imoveis";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  return (
    <nav className="sticky top-0 z-50 h-16 sm:h-20 backdrop-blur-xl bg-[#0F172A]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-5 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold tracking-tight text-sm sm:text-lg shrink-0">
          <span className="w-9 h-9 rounded-xl bg-[#10B981] grid place-items-center"><Home className="w-5 h-5 text-[#0F172A]" /></span>
          <span>MEU LAR <span className="text-[#34D399] hidden min-[400px]:inline">IMÓVEIS</span></span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/anunciar" className="min-h-[44px] px-3 flex items-center gap-2 rounded-xl text-slate-300 hover:text-[#34D399] transition">
                <Megaphone className="w-4 h-4" /><span className="hidden sm:inline">Anunciar</span>
              </Link>
              <span className="hidden md:block text-slate-400 max-w-[140px] truncate">{nomeDoUsuario(user)}</span>
              <button onClick={() => base44.auth.logout("/")} className="min-h-[44px] px-3 flex items-center gap-2 rounded-xl bg-[#1E293B] text-slate-200 hover:text-white">
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-3 text-slate-300 hover:text-white">Entrar</Link>
              <Link to="/register" className="min-h-[44px] px-4 sm:px-5 grid place-items-center rounded-xl bg-[#10B981] text-[#0F172A] font-semibold hover:bg-[#34D399] transition">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}