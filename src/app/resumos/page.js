import Protegido from "@/modules/auth/Protegido";
import ResumosClient from "@/modules/resumos/ResumosClient";

export const metadata = { title: "Resumos — MeuENEM" };

export default function ResumosPage() {
  return (
    <Protegido>
      <ResumosClient />
    </Protegido>
  );
}
