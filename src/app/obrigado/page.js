import ObrigadoClient from "@/modules/pagamento/ObrigadoClient";

export const metadata = {
  title: "Pagamento confirmado — MeuENEM",
  robots: { index: false },
};

export default function ObrigadoPage() {
  return <ObrigadoClient />;
}
