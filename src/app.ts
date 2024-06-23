import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import express, {Request, Response} from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import config from './.utils/config'
import listEndpoints from 'express-list-endpoints'
import authRouter from './auth/auth.controller'
import { myDataSource } from "./.database/pg/db"
import {logger} from "./.utils/winston.logger"
import { errorHandler } from './.utils/errorHandler'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(helmet())

app.use(cors({ origin: "*" }))

const limiter = rateLimit({
    windowMs:2 * 60 *1000,
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
app.get('/health',(_:Request,res:Response)=>{
    res.status(200).send("Connected")
})

app.use('/auth', authRouter)

app.use(errorHandler)


app.listen(config.SERVER.PORT,()=>{
    console.table(listEndpoints(app))
})


