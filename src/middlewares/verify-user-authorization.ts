import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user || !role.includes(request.user.role)) {
      throw new AppError("Usuário não autenticado", 401);
    }
    return next();
  };
}

export { verifyUserAuthorization };
