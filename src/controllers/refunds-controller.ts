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

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return response.status(200).json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages,
      },
    });
  }
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const refund = await prisma.refunds.findFirst({
      where: {
        id,
      },
    });

    if (!refund) {
      throw new AppError("Reembolso não encontrado", 404);
    }

    return response.status(200).json(refund);
  }
}

export { RefundsController };
