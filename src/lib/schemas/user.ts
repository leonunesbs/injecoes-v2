import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email deve ter um formato válido")
    .min(1, "Email é obrigatório"),
  image: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
