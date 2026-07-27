import Stripe from "stripe";

// Cliente Stripe (servidor). Criado só quando usado, para não quebrar o build
// caso a chave ainda não esteja configurada.
let _stripe = null;
export function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY não configurada");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// Preço do acesso em centavos (R$ 47,90). Ajuste aqui se mudar o valor.
export const PRECO_CENTAVOS = 4790;
export const PRODUTO_NOME = "MeuENEM — Acesso vitalício";
