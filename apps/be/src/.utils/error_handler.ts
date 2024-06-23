import { NextFunction, Request, Response } from "express"
import { inspect } from "util"
import { logger } from "./winston.logger"

export class AppError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
  }
}

export function errorHandler(
  err: Error | AppError,
  _: Request,
  res: Response,
  _1: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    })
  }
  logger.error(inspect(err))
}

export const catchWrapper =
  (callback: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next)
    } catch (err: any) {
      errorHandler(err, req, res, next)
    }
  }
