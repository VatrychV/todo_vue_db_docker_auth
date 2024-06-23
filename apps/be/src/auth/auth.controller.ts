import { instanceToPlain } from "class-transformer"
import express, { Request, Response } from "express"
import { catchWrapper } from "../.utils/error_handler"
import { logger } from "../.utils/winston.logger"
import { AuthService } from "./auth.service"

const router = express.Router()

router.post(
  "/register",
  catchWrapper(async (req: Request, res: Response) => {
    // TODO Use zod for input validation
    logger.info(
      `User is registering with data: ${req.body.email}`,
      "AuthRouter, register"
    )

    const user_response = await AuthService.register(req.body)

    const user = instanceToPlain(user_response.user)
    res.setHeader("Set-Cookie", user_response.cookies)
    res.status(200).send(user)
  })
)

router.post(
  "/login",
  catchWrapper(async (req: Request, res: Response) => {
    const user_response = await AuthService.login(req.body)

    const user = instanceToPlain(user_response.user)
    res.setHeader("Set-Cookie", user_response.cookies)
    res.status(200).send(user)
  })
)

export default router
