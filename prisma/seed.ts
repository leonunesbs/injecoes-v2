import { db } from "~/server/db";

// Dados padrão para Indicações Médicas
const indications = [
  {
    code: "RD/EMD",
    name: "Retinopatia Diabética com Edema Macular Diabético",
    description:
      "Complicação da diabetes que afeta a mácula, causando edema e perda de visão central",
    isActive: true,
  },
  {
    code: "RD/HV",
    name: "Retinopatia Diabética com Hemorragia Vítrea",
    description:
      "Complicação da diabetes caracterizada por sangramento no vítreo",
    isActive: true,
  },
  {
    code: "DMRI",
    name: "Degeneração Macular Relacionada à Idade",
    description:
      "Condição degenerativa da mácula que afeta principalmente idosos",
    isActive: true,
  },
  {
    code: "OV",
    name: "Oclusão Venosa",
    description:
      "Bloqueio das veias da retina, causando isquemia e edema macular",
    isActive: true,
  },
  {
    code: "MNVSR",
    name: "Membrana Neovascular Sub-Retiniana",
    description:
      "Formação de vasos anormais sob a retina, causando vazamentos e hemorragias",
    isActive: true,
  },
];

// Dados padrão para Medicamentos
const medications = [
  {
    code: "LUCENTIS",
    name: "Lucentis",
    activeSubstance: "Ranibizumab",
    isActive: true,
  },
  {
    code: "AVASTIN",
    name: "Avastin",
    activeSubstance: "Bevacizumab",
    isActive: true,
  },
  {
    code: "EYLIA",
    name: "Eylia",
    activeSubstance: "Aflibercept",
    isActive: true,
  },
];

// Dados padrão para Classificação Swalis
const swalisClassifications = [
  {
    code: "A1",
    name: "A1",
    description: "Paciente com risco de deterioração clínica iminente",
    priority: 1,
    isActive: true,
  },
  {
    code: "A2",
    name: "A2",
    description:
      "Paciente com as atividades diárias completamente prejudicadas",
    priority: 2,
    isActive: true,
  },
  {
    code: "B",
    name: "B",
    description: "Paciente com prejuízo acentuado das atividades diárias",
    priority: 3,
    isActive: true,
  },
  {
    code: "C",
    name: "C",
    description: "Paciente com prejuízo mínimo das atividades diárias",
    priority: 4,
    isActive: true,
  },
  {
    code: "D",
    name: "D",
    description: "Não há prejuízo para as atividades diárias",
    priority: 5,
    isActive: true,
  },
];

// Usuário padrão do sistema
const defaultUser = {
  id: "system-user",
  name: "Sistema",
  email: "sistema@injecoes.com",
  emailVerified: new Date(),
};

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Seed Usuário padrão
    console.log("👤 Criando usuário padrão do sistema...");
    await db.user.upsert({
      where: { id: defaultUser.id },
      update: {},
      create: defaultUser,
    });
    console.log("✅ Usuário padrão criado/atualizado");
    // Seed Indicações
    console.log("📋 Criando indicações médicas...");
    for (const indication of indications) {
      await db.indication.upsert({
        where: { code: indication.code },
        update: {},
        create: indication,
      });
    }
    console.log(`✅ ${indications.length} indicações criadas/atualizadas`);

    // Seed Medicamentos
    console.log("💊 Criando medicamentos...");
    for (const medication of medications) {
      await db.medication.upsert({
        where: { code: medication.code },
        update: {},
        create: medication,
      });
    }
    console.log(`✅ ${medications.length} medicamentos criados/atualizados`);

    // Seed Classificações Swalis
    console.log("🏥 Criando classificações Swalis...");
    for (const swalis of swalisClassifications) {
      await db.swalisClassification.upsert({
        where: { code: swalis.code },
        update: {},
        create: swalis,
      });
    }
    console.log(
      `✅ ${swalisClassifications.length} classificações Swalis criadas/atualizadas`,
    );

    console.log("🎉 Seed data criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("💥 Falha no seed:", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("🔌 Desconectando do banco de dados...");
    void db.$disconnect();
  });
