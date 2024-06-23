import { NextFunction, Request, Response } from "express"
import { AppError } from "../.utils/error_handler"
import { AuthService } from "../auth/auth.service"
import { IUser } from "../interfaces/entities.interface"
import { UserService } from "../user/user.service"

export interface RequestWithUser extends Request {
  user: IUser
}

async function jwtAuth(req: Request, _: Response, next: NextFunction) {
  const token = req.cookies["Auth"]
  if (!token) next(new AppError("Access denied", 401))

  try {
    const payload = AuthService.verifyAuthToken(token)
    const user = await UserService.findOneOrFail({ where: { id: payload.id } })

    // @ts-ignore - ignoring not existing user field
    req.user = user
    next()
  } catch (error) {
    next(new AppError("Access denied", 401))
  }
}

// TODO Create Refresh Auth

export { jwtAuth }
