import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Header from "@/components/imoveis/Header";
import BecomeAdvertiser from "@/components/anunciar/BecomeAdvertiser";
import ListingForm from "@/components/anunciar/ListingForm";
import MyListings from "@/components/anunciar/MyListings";

export default function Anunciar() {
  const { user } = useAuth();
  const anunciante = user?.tipo_conta === "anunciante" && user?.whatsapp;
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <Link to="/" className="inline-flex items-center gap-2 min-h-[48px] text-slate-300 hover:text-[#34D399]"><ArrowLeft className="w-5 h-5" />Voltar</Link>
        <div className="mt-2">
          {anunciante ? (<><ListingForm /><MyListings /></>) : <BecomeAdvertiser />}
        </div>
      </main>
    </div>
  );
}