import { z } from "zod";

// Indication Schema
export const indicationSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(10, "Código deve ter no máximo 10 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type IndicationFormData = z.infer<typeof indicationSchema>;
