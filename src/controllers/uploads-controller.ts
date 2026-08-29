import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";


class UploadsController {
    async create(request: Request, response: Response) {
        if (!request.file) {
            throw new AppError("File is required", 400);
        }

        const { filename } = request.file;

        return response.status(201).json({
            filename,
        });
    }
}

export { UploadsController };