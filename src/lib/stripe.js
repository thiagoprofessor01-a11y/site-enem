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

// Planos de assinatura (cobrança recorrente).
//  - valorCentavos: quanto é cobrado a cada ciclo, em centavos
//  - intervalo / intervaloContagem: periodicidade da renovação na Stripe
// Para trocar para pagamento avulso (Pix/boleto), veja o checkout route.
export const PLANOS_STRIPE = {
  mensal: {
    nome: "MeuENEM — Assinatura mensal",
    valorCentavos: 2490,
    intervalo: "month",
    intervaloContagem: 1,
  },
  trimestral: {
    nome: "MeuENEM — Assinatura trimestral",
    valorCentavos: 5790,
    intervalo: "month",
    intervaloContagem: 3,
  },
};
