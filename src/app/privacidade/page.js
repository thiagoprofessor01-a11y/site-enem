import { LegalShell, Secao, Aviso } from "@/components/LegalShell";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/config";

export const metadata = { title: "Política de Privacidade — " + SITE.nome };

export default function PrivacidadePage() {
  return (
    <LegalShell titulo="Política de Privacidade" atualizado={LEGAL.atualizadoEm}>
      <p className="text-sm leading-relaxed text-slate-600">
        Esta Política explica como o {SITE.nome}, operado por{" "}
        <strong>{LEGAL.empresa}</strong> ({LEGAL.cnpj}), coleta, usa e protege
        seus dados pessoais, em conformidade com a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018 — LGPD).
      </p>

      <Aviso>
        <strong>Menores de idade:</strong> este é um site voltado a estudantes e
        pode ser usado por adolescentes. Se você tem menos de{" "}
        {LEGAL.idadeMenorConsentimento} anos, o cadastro e o uso devem contar com
        o consentimento e a supervisão de um dos pais ou responsável legal. Veja
        a seção “Dados de crianças e adolescentes”.
      </Aviso>

      <Secao titulo="1. Quais dados coletamos">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Cadastro:</strong> nome, e-mail, senha (armazenada de forma criptografada) e data de nascimento.</li>
          <li><strong>Estudo:</strong> data prevista do ENEM, horas disponíveis, aulas concluídas, respostas de questões e progresso.</li>
          <li><strong>Redações:</strong> os textos que você escreve na plataforma.</li>
          <li><strong>Pagamento:</strong> processado pelo Mercado Pago. Não armazenamos os dados do seu cartão.</li>
          <li><strong>Técnicos:</strong> dados de acesso (data/hora, tipo de dispositivo) e cookies necessários ao funcionamento.</li>
        </ul>
      </Secao>

      <Secao titulo="2. Para que usamos (finalidades)">
        <ul className="list-disc space-y-1 pl-5">
          <li>Criar e manter sua conta e liberar o acesso comprado.</li>
          <li>Montar seu cronograma e acompanhar seu progresso.</li>
          <li>Processar o pagamento e emitir comprovantes.</li>
          <li>Dar suporte e comunicar avisos importantes do serviço.</li>
          <li>Cumprir obrigações legais e prevenir fraudes.</li>
        </ul>
      </Secao>

      <Secao titulo="3. Base legal (art. 7º e 11 da LGPD)">
        <p>
          Tratamos seus dados para <strong>execução do contrato</strong> (a
          prestação do serviço que você contratou), para{" "}
          <strong>cumprimento de obrigação legal</strong> (ex.: fiscal) e, quando
          aplicável, com base no seu <strong>consentimento</strong> (ex.:
          comunicações de marketing), que pode ser retirado a qualquer momento.
        </p>
      </Secao>

      <Secao titulo="4. Com quem compartilhamos">
        <p>
          Não vendemos seus dados. Compartilhamos apenas com prestadores
          (operadores) necessários para o funcionamento do site, que tratam os
          dados sob nossas instruções:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {LEGAL.operadores.map((o) => (
            <li key={o.nome}>
              <strong>{o.nome}</strong> — {o.papel}.
            </li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="5. Transferência internacional">
        <p>
          Mantemos o banco de dados na região <strong>São Paulo (Brasil)</strong>.
          Alguns prestadores podem processar dados fora do país; nesses casos,
          exigimos garantias adequadas de proteção, conforme o art. 33 da LGPD.
        </p>
      </Secao>

      <Secao titulo="6. Por quanto tempo guardamos">
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa e pelo prazo
          necessário para cumprir obrigações legais. Você pode solicitar a
          exclusão a qualquer momento (ver seção 8).
        </p>
      </Secao>

      <Secao titulo="7. Como protegemos">
        <p>
          Adotamos medidas de segurança como criptografia em trânsito (HTTPS) e
          em repouso, controle de acesso por usuário, senhas armazenadas com
          hash e restrição de quem pode alterar dados. Nenhum sistema é 100%
          infalível, mas trabalhamos para reduzir riscos.
        </p>
      </Secao>

      <Secao titulo="8. Seus direitos (art. 18 da LGPD)">
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Confirmação e acesso aos seus dados;</li>
          <li>Correção de dados incompletos ou desatualizados;</li>
          <li>Exclusão ou anonimização dos dados;</li>
          <li>Portabilidade dos dados;</li>
          <li>Informação sobre com quem compartilhamos;</li>
          <li>Revogação do consentimento.</li>
        </ul>
        <p>
          Para exercer esses direitos, fale com nosso Encarregado (DPO):{" "}
          <a href={`mailto:${LEGAL.email}`} className="font-semibold text-brand-700">
            {LEGAL.email}
          </a>
          .
        </p>
      </Secao>

      <Secao titulo="9. Dados de crianças e adolescentes (art. 14 da LGPD)">
        <p>
          O tratamento de dados de crianças e adolescentes é feito sempre em seu
          <strong> melhor interesse</strong>. Para menores de{" "}
          {LEGAL.idadeMenorConsentimento} anos, o cadastro deve ser realizado com
          o consentimento de pelo menos um dos pais ou responsável legal, que se
          declara ciente e concorda com esta Política no momento do cadastro.
          Coletamos apenas os dados necessários para o serviço educacional e não
          exigimos informações além do essencial. O responsável pode, a qualquer
          momento, solicitar acesso, correção ou exclusão dos dados do menor pelo
          e-mail acima.
        </p>
      </Secao>

      <Secao titulo="10. Cookies">
        <p>
          Usamos cookies necessários para manter você conectado e lembrar
          preferências. Você pode gerenciar cookies no seu navegador; alguns são
          essenciais para o funcionamento do site.
        </p>
      </Secao>

      <Secao titulo="11. Alterações e contato">
        <p>
          Podemos atualizar esta Política. Mudanças relevantes serão comunicadas
          no site. Dúvidas ou solicitações:{" "}
          <a href={`mailto:${LEGAL.email}`} className="font-semibold text-brand-700">
            {LEGAL.email}
          </a>
          .
        </p>
      </Secao>
    </LegalShell>
  );
}
