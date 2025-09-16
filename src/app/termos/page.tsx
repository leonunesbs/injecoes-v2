import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do sistema Injecções — Gerenciamento AntiVEGF.",
  alternates: { canonical: "/termos" },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-12">
      <h1 className="mb-6 text-3xl font-bold">Termos de Uso</h1>
      <p className="text-muted-foreground mb-4">
        Bem-vindo ao sistema Injecções. Ao utilizar esta aplicação, você
        concorda com os seguintes termos e condições.
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. Uso Autorizado</h2>
      <p className="text-muted-foreground mt-2">
        O sistema é destinado a uso interno e restrito. É proibida a utilização
        para fins ilícitos ou não autorizados.
      </p>
      <h2 className="mt-8 text-xl font-semibold">2. Acesso e Contas</h2>
      <p className="text-muted-foreground mt-2">
        Você é responsável por manter a confidencialidade de suas credenciais e
        por todas as atividades realizadas na sua conta.
      </p>
      <h2 className="mt-8 text-xl font-semibold">3. Dados e Privacidade</h2>
      <p className="text-muted-foreground mt-2">
        O tratamento de dados segue a nossa Política de Privacidade disponível
        em /privacidade.
      </p>
      <h2 className="mt-8 text-xl font-semibold">4. Disponibilidade</h2>
      <p className="text-muted-foreground mt-2">
        Podemos modificar, suspender ou encerrar o serviço a qualquer momento
        sem aviso prévio.
      </p>
      <h2 className="mt-8 text-xl font-semibold">5. Contato</h2>
      <p className="text-muted-foreground mt-2">
        Dúvidas? Entre em contato com o administrador do sistema.
      </p>
      <p className="text-muted-foreground mt-8 text-sm">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
