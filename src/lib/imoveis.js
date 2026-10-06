export const formatarPreco = (p) =>
  Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) + (p.tipo === "Alugar" ? "/mês" : "");

export const localDe = (p) => [p.bairro, p.cidade].filter(Boolean).join(", ");

export const whatsLink = (numero, msg) => {
  let d = String(numero || "").replace(/\D/g, "");
  if (d.length <= 11) d = "55" + d;
  return `https://wa.me/${d}?text=${encodeURIComponent(msg)}`;
};

export const nomeDoUsuario = (u) => u?.nome_exibicao || u?.full_name || u?.email?.split("@")[0] || "Usuário";