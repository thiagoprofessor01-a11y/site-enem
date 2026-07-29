import Protegido from "@/modules/auth/Protegido";
import SimuladosClient from "@/modules/simulados/SimuladosClient";

export const metadata = { title: "Simulados — MeuENEM" };

export default function SimuladosPage() {
  return (
    <Protegido>
      <SimuladosClient />
    </Protegido>
  );
}
