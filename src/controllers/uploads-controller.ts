import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import uploadConfig from "@/config/upload";
import z, { ZodError } from "zod";
import { DiskStorage } from "@/providers/disk-storage";

class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage();

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Arquivo é obrigatório"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              {
                message: "Formato de arquivo inválido",
              },
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              `Arquivo excede o tamanho máximo permitido de ${uploadConfig.MAX_SIZE}MB`,
            ),
        })
        .passthrough();

      const file = fileSchema.parse(request.file);

      const fileName = await diskStorage.saveFile(file.filename);

      return response.json({ fileName });
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp");
        }

        throw new AppError(error.issues[0].message);
      }
      throw error;
    }
  }
}

export { UploadsController };
