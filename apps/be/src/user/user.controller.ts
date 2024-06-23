import { instanceToPlain } from "class-transformer"
import express, { Response } from "express"
import { RequestWithUser, jwtAuth } from "../.middleware/auth.middleware"
import { catchWrapper } from "../.utils/error_handler"
import { logger } from "../.utils/winston.logger"

const router = express.Router()

router.get(
  "/me",
  jwtAuth,
  catchWrapper((req: RequestWithUser, res: Response) => {
    logger.info(`User requested info`, "UserController, me")

    const user = instanceToPlain(req.user)
    res.send(user)
  })
)

export default router
