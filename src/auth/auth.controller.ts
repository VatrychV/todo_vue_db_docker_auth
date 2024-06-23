import express , {Request, Response} from 'express'
import { logger } from "../.utils/winston.logger"
import { AuthService } from './auth.service'
import { catchWrapper } from '../.utils/errorHandler'
 
const router = express.Router()

router.post('/register',
     catchWrapper (async (req:Request,res:Response)=>{
    logger.info(`User is registering with data: ${JSON.stringify(req.body)}`, "AuthRouter, register")
    //TODO

    const user_responce = await AuthService.register(req.body)
    res.setHeader("Set-cookie", user_responce.cookies)
    res.status(200).send(user_responce.user)
}))

export default router