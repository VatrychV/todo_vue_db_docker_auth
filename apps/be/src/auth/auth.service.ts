import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { myDataSource } from "../.database/pg/db"
import config from "../.utils/config"
import { AppError } from "../.utils/error_handler"
import { IJWTTokenPayload } from "../interfaces"
import { UserService } from "../user/user.service"

const jwt_secret = config.JWT.SECRET

export namespace AuthService {
  export async function register(dto: {
    name: string
    email: string
    password: string
  }) {
    if (!(dto.name && dto.email && dto.password))
      throw new AppError("Invalid data", 400)

    dto.email = dto.email.toLowerCase()

    const existing_user = await UserService.findOne({
      where: { email: dto.email },
    })
    if (existing_user) throw new AppError("User already exists!", 400)

    const hashed_password = await bcrypt.hash(dto.password, 10)

    return myDataSource.transaction(async (manager) => {
      const user = await UserService.create(
        manager,
        dto.email,
        dto.name,
        hashed_password
      )

      //   TODO Implement Refresh token -> create refresh -> store in user table -> return with info
      const auth_cookie = generateAuthCookie(user.id)
      return { user, cookies: [auth_cookie] }
    })
  }

  export async function login(dto: { email: string; password: string }) {
    if (!(dto.email && dto.password)) throw new AppError("Invalid data", 400)

    dto.email = dto.email.toLowerCase()
    const user = await UserService.findOneOrFail({
      where: { email: dto.email },
    })

    const pass_match = await bcrypt.compare(dto.password, user.password)
    if (!pass_match) throw new AppError("Authentication failed", 401)

    const auth_cookie = generateAuthCookie(user.id)
    return { user, cookies: [auth_cookie] }
  }

  // # JWT
  export function generateAuthCookie(id: number): string {
    const jwt = generateAuthJwt(id)

    const secure = config.SERVER.NODE_TYPE === "development" ? "" : "secure;"
    const domain =
      config.SERVER.NODE_TYPE === "development"
        ? "localhost"
        : config.SERVER.DOMAIN
    return `Auth=${jwt}; HttpOnly; Path=/; Max-Age=${config.JWT.EXPIRE_TIME}; domain=${domain}; SameSite=Lax; ${secure}`
  }

  export function generateAuthJwt(id: number): string {
    const data: IJWTTokenPayload = {
      id: id,
    }
    const validFor: jwt.SignOptions = { expiresIn: config.JWT.EXPIRE_TIME }
    return jwt.sign(data, jwt_secret, validFor)
  }

  export function verifyAuthToken(token: string) {
    return jwt.verify(token, jwt_secret) as IJWTTokenPayload
  }
}
