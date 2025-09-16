import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade do sistema Injecções — Gerenciamento AntiVEGF.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-12">
      <h1 className="mb-6 text-3xl font-bold">Política de Privacidade</h1>
      <p className="text-muted-foreground mb-4">
        Esta Política descreve como tratamos dados pessoais no sistema
        Injecções.
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. Dados Coletados</h2>
      <p className="text-muted-foreground mt-2">
        Coletamos dados de autenticação, registros de uso e informações
        necessárias para gestão clínica.
      </p>
      <h2 className="mt-8 text-xl font-semibold">2. Base Legal</h2>
      <p className="text-muted-foreground mt-2">
        O tratamento de dados se baseia em execução de contrato e legítimo
        interesse para prestação do serviço.
      </p>
      <h2 className="mt-8 text-xl font-semibold">3. Compartilhamento</h2>
      <p className="text-muted-foreground mt-2">
        Não vendemos dados. Compartilhamentos ocorrem apenas quando estritamente
        necessários para operação.
      </p>
      <h2 className="mt-8 text-xl font-semibold">4. Segurança</h2>
      <p className="text-muted-foreground mt-2">
        Adotamos medidas técnicas e organizacionais para proteger os dados.
      </p>
      <h2 className="mt-8 text-xl font-semibold">5. Direitos do Titular</h2>
      <p className="text-muted-foreground mt-2">
        Você pode solicitar acesso, correção ou exclusão de dados conforme a
        legislação aplicável.
      </p>
      <h2 className="mt-8 text-xl font-semibold">6. Contato</h2>
      <p className="text-muted-foreground mt-2">
        Para solicitações, contate o administrador do sistema.
      </p>
      <p className="text-muted-foreground mt-8 text-sm">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
