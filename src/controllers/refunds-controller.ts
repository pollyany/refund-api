import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import z from "zod";

const CategoriesEnum = z.enum([
  "food",
  "accommodation",
  "others",
  "transport",
  "services",
]);
class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, "Informe o nome da solicitação de reembolso"),
      category: CategoriesEnum,
      amount: z.number().positive("O valor do reembolso deve ser positivo"),
      filename: z.string().min(20),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(201).json({
      refund,
    });
  }
}

export { RefundsController };