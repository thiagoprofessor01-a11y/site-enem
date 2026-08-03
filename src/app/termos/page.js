import { LegalShell, Secao, Aviso } from "@/components/LegalShell";
import { LEGAL } from "@/lib/legal";
import { SITE, PLANOS } from "@/lib/config";

export const metadata = { title: "Termos de Uso — " + SITE.nome };

export default function TermosPage() {
  return (
    <LegalShell titulo="Termos de Uso" atualizado={LEGAL.atualizadoEm}>
      <p className="text-sm leading-relaxed text-slate-600">
        Estes Termos regulam o uso do {SITE.nome}, operado por{" "}
        <strong>{LEGAL.empresa}</strong>. Ao criar uma conta ou usar a
        plataforma, você concorda com estes Termos e com a{" "}
        <a href="/privacidade" className="font-semibold text-brand-700">
          Política de Privacidade
        </a>
        .
      </p>

      <Secao titulo="1. O que é o serviço">
        <p>
          O {SITE.nome} é uma plataforma de estudos para o ENEM, com cronograma,
          conteúdos, questões e redação. O acesso é liberado após o pagamento.
        </p>
      </Secao>

      <Secao titulo="2. Cadastro e conta">
        <p>
          Você é responsável por manter seus dados de acesso em sigilo e pela
          veracidade das informações fornecidas. A conta é pessoal e
          intransferível.
        </p>
      </Secao>

      <Aviso>
        <strong>Menores de idade:</strong> se você tem menos de{" "}
        {LEGAL.idadeMenorConsentimento} anos, precisa do consentimento e da
        supervisão de um responsável legal para se cadastrar e usar a plataforma.
      </Aviso>

      <Secao titulo="3. Pagamento e acesso">
        <p>
          O acesso é por assinatura, com dois planos: mensal (R${" "}
          {PLANOS[0].preco}, renovado a cada mês) e trimestral (R${" "}
          {PLANOS[1].preco}, renovado a cada 3 meses). A assinatura renova
          automaticamente ao fim de cada período até que você cancele, e o acesso
          é liberado após a confirmação do pagamento. Você pode cancelar a
          qualquer momento e mantém o acesso até o fim do período já pago. Direito
          de arrependimento em compras online: você pode desistir em até 7 dias
          corridos, conforme o art. 49 do Código de Defesa do Consumidor.
        </p>
      </Secao>

      <Secao titulo="4. Uso permitido">
        <p>
          O conteúdo é para seu estudo pessoal. É proibido copiar, redistribuir,
          revender ou compartilhar seu acesso com terceiros.
        </p>
      </Secao>

      <Secao titulo="5. Conteúdo de terceiros">
        <p>
          As videoaulas são incorporadas do YouTube e pertencem a seus
          respectivos autores. As questões de provas anteriores são de domínio
          público (INEP).
        </p>
      </Secao>

      <Secao titulo="6. Limitação de responsabilidade">
        <p>
          A plataforma é uma ferramenta de apoio aos estudos e não garante
          aprovação ou nota específica no ENEM. Buscamos manter o serviço
          disponível, mas podem ocorrer interrupções para manutenção.
        </p>
      </Secao>

      <Secao titulo="7. Encerramento">
        <p>
          Você pode encerrar sua conta a qualquer momento. Podemos suspender
          contas que violem estes Termos.
        </p>
      </Secao>

      <Secao titulo="8. Contato">
        <p>
          Dúvidas sobre estes Termos:{" "}
          <a href={`mailto:${LEGAL.email}`} className="font-semibold text-brand-700">
            {LEGAL.email}
          </a>
          .
        </p>
      </Secao>
    </LegalShell>
  );
}
