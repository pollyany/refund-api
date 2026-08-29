import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  role: string;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token is missing", 401);
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: userId } = verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = {
      id: userId,
      role: role,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401);
  }
}
