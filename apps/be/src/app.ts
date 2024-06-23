import cookieParser from "cookie-parser"
import cors from "cors"
import express, { Request, Response } from "express"
import listEndpoints from "express-list-endpoints"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import "reflect-metadata"
import { myDataSource } from "./.database/pg/db"
import config from "./.utils/config"
import { errorHandler } from "./.utils/error_handler"
import { logger } from "./.utils/winston.logger"
import authRouter from "./auth/auth.controller"
import userRouter from "./user/user.controller"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use(cors({ origin: "*" }))

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  message: "Piss Off",
})
app.use(limiter)

myDataSource
  .initialize()
  .then(() => {
    logger.info("\nDB Connected\n")
  })
  .catch((err) => {
    logger.error("\nError during DB initialization:\n", err)
    throw err
  })

//! Routes
app.get("/health", (_: Request, res: Response) => {
  res.status(200).send("Connected")
})
app.use("/auth", authRouter)
app.use("/user", userRouter)

app.use("/*", (_, res) => {
  res.status(404).send("Not Found")
})

app.use(errorHandler)

app.listen(config.SERVER.PORT, () => {
  logger.info(`Server started on port:${config.SERVER.PORT}`)
  console.table(listEndpoints(app))
})
