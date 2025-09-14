import { z } from "zod";

// Medication Schema
export const medicationSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  activeSubstance: z
    .string()
    .min(1, "Substância ativa é obrigatória")
    .max(100, "Substância ativa deve ter no máximo 100 caracteres"),
  isActive: z.boolean(),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;
