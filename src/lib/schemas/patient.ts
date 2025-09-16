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
  balanceOD: z.number().min(0, "Restante OD não pode ser negativo").default(0),
  balanceOS: z.number().min(0, "Restante OS não pode ser negativo").default(0),
  startWithOD: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type PatientSettingsFormData = z.infer<typeof patientSettingsSchema>;

// Patient Indication Schema (for creating new patient indications)
export const patientIndicationSchema = z
  .object({
    id: z.string().optional(),
    patientRefId: z
      .number()
      .int("ID do paciente deve ser um número inteiro")
      .positive("ID do paciente deve ser um número positivo"),
    patientName: z
      .string()
      .min(1, "Nome do paciente é obrigatório")
      .max(100, "Nome do paciente deve ter no máximo 100 caracteres"),
    indicationId: z.string().optional(),
    indicationOther: z.string().optional(),
    medicationId: z.string().optional(),
    medicationOther: z.string().optional(),
    swalisId: z.string().min(1, "Classificação Swalis é obrigatória"),
    observations: z.string().optional(),
    indicationOD: z.number().min(0, "Indicações OD não podem ser negativas"),
    indicationOE: z.number().min(0, "Indicações OE não podem ser negativas"),
    startWithOD: z.boolean(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine(
    (data) => {
      // Either indicationId or indicationOther must be provided
      return [data.indicationId, data.indicationOther].some(
        (value) => (value?.trim() ?? "") !== "",
      );
    },
    {
      message:
        "Indicação é obrigatória - selecione uma indicação ou digite uma personalizada",
      path: ["indicationId"],
    },
  )
  .refine(
    (data) => {
      // Either medicationId or medicationOther must be provided
      return [data.medicationId, data.medicationOther].some(
        (value) => (value?.trim() ?? "") !== "",
      );
    },
    {
      message:
        "Medicação é obrigatória - selecione uma medicação ou digite uma personalizada",
      path: ["medicationId"],
    },
  );

export type PatientIndicationFormData = z.infer<typeof patientIndicationSchema>;

// Base schema without refinements for API usage
export const patientIndicationBaseSchema = z.object({
  id: z.string().optional(),
  patientRefId: z
    .number()
    .int("ID do paciente deve ser um número inteiro")
    .positive("ID do paciente deve ser um número positivo"),
  patientName: z
    .string()
    .min(1, "Nome do paciente é obrigatório")
    .max(100, "Nome do paciente deve ter no máximo 100 caracteres"),
  indicationId: z.string().optional(),
  indicationOther: z.string().optional(),
  medicationId: z.string().optional(),
  medicationOther: z.string().optional(),
  swalisId: z.string().min(1, "Classificação Swalis é obrigatória"),
  observations: z.string().optional(),
  indicationOD: z.number().min(0, "Indicações OD não podem ser negativas"),
  indicationOE: z.number().min(0, "Indicações OE não podem ser negativas"),
  startWithOD: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Patient Basic Info Update Schema
export const patientBasicInfoSchema = z.object({
  refId: z
    .string()
    .min(1, "ID de referência é obrigatório")
    .max(20, "ID de referência deve ter no máximo 20 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  birthDate: z.date().nullable().optional(),
});

export type PatientBasicInfoFormData = z.infer<typeof patientBasicInfoSchema>;
