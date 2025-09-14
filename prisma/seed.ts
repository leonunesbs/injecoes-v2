import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dados padrão para Indicações Médicas
const indications = [
  {
    code: "RD_EMD",
    name: "Retinopatia Diabética com Edema Macular Diabético",
    description:
      "Complicação da diabetes que afeta a mácula, causando edema e perda de visão central",
    isActive: true,
  },
  {
    code: "RD_HV",
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
  {
    code: "OUTROS",
    name: "Outros",
    description: "Outras indicações não especificadas",
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
  {
    code: "BEVACIZUMAB",
    name: "Bevacizumab",
    activeSubstance: "Bevacizumab",
    isActive: true,
  },
  {
    code: "RANIBIZUMAB",
    name: "Ranibizumab",
    activeSubstance: "Ranibizumab",
    isActive: true,
  },
  {
    code: "AFLIBERCEPT",
    name: "Aflibercept",
    activeSubstance: "Aflibercept",
    isActive: true,
  },
  {
    code: "OUTRO",
    name: "Outro",
    activeSubstance: "Personalizado",
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

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Seed Indicações
    console.log("📋 Criando indicações médicas...");
    for (const indication of indications) {
      await prisma.indication.upsert({
        where: { code: indication.code },
        update: {},
        create: indication,
      });
    }
    console.log(`✅ ${indications.length} indicações criadas/atualizadas`);

    // Seed Medicamentos
    console.log("💊 Criando medicamentos...");
    for (const medication of medications) {
      await prisma.medication.upsert({
        where: { code: medication.code },
        update: {},
        create: medication,
      });
    }
    console.log(`✅ ${medications.length} medicamentos criados/atualizados`);

    // Seed Classificações Swalis
    console.log("🏥 Criando classificações Swalis...");
    for (const swalis of swalisClassifications) {
      await prisma.swalisClassification.upsert({
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
  .finally(async () => {
    console.log("🔌 Desconectando do banco de dados...");
    await prisma.$disconnect();
  });
