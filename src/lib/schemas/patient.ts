import { z } from "zod";

// Patient Schema (simplified for settings)
export const patientSettingsSchema = z.object({
  id: z.string().optional(),
  refId: z
    .string()
    .min(1, "ID de referência é obrigatório")
    .max(20, "ID de referência deve ter no máximo 20 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  birthDate: z.date().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  indicationId: z.string().min(1, "Indicação é obrigatória"),
  medicationId: z.string().min(1, "Medicação é obrigatória"),
  swalisId: z.string().min(1, "Classificação Swalis é obrigatória"),
  indicationOther: z.string().optional(),
  medicationOther: z.string().optional(),
  balanceOD: z.number().min(0, "Saldo OD não pode ser negativo").default(0),
  balanceOS: z.number().min(0, "Saldo OS não pode ser negativo").default(0),
  startWithOD: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type PatientSettingsFormData = z.infer<typeof patientSettingsSchema>;

// Patient Indication Schema (for creating new patient indications)
export const patientIndicationSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, "ID do paciente é obrigatório"),
  patientName: z
    .string()
    .min(1, "Nome do paciente é obrigatório")
    .max(100, "Nome do paciente deve ter no máximo 100 caracteres"),
  indicationId: z.string().min(1, "Indicação é obrigatória"),
  medicationId: z.string().min(1, "Medicação é obrigatória"),
  swalisId: z.string().min(1, "Classificação Swalis é obrigatória"),
  observations: z.string().optional(),
  indicationOD: z.number().min(0, "Indicações OD não podem ser negativas"),
  indicationOE: z.number().min(0, "Indicações OE não podem ser negativas"),
  startWithOD: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type PatientIndicationFormData = z.infer<typeof patientIndicationSchema>;
