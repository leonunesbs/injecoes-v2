import { z } from "zod";

// Swalis Classification Schema
export const swalisClassificationSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(5, "Código deve ter no máximo 5 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  priority: z
    .number()
    .min(1, "Prioridade deve ser pelo menos 1")
    .max(10, "Prioridade deve ser no máximo 10"),
  isActive: z.boolean(),
});

export type SwalisClassificationFormData = z.infer<
  typeof swalisClassificationSchema
>;
