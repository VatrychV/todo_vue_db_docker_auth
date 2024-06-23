import bcrypt from "bcrypt";
import { myDataSource } from "../.database/pg/db";
import { AppError } from "../.utils/errorHandler";
import { UserService } from "../user/user.service";
import config from "../.utils/config";
import jwt from "jsonwebtoken"


const jwt_secret = config.JWT.SECRET


export namespace AuthService{
    export async function register(dto: {name:string, email:string;password:string }){
        dto.email = dto.email.toLowerCase()
        if(!(dto.name&&dto.email&&dto.password)) throw new AppError ("Invalid data", 400)
        
            const existing_user = await UserService.findOne({where : {email:dto.email}})
            if (existing_user) throw new AppError ("User already exists!", 400)
            
            const hashed_password = await bcrypt.hash(dto.password, 10)

        return myDataSource.transaction(async (manager)=>{
            const user = await UserService.create(manager, dto.email, dto.name, hashed_password)


            // Todo Implement Refresh token -> create refresh -> store in teble -> return with info

            const auth_cookie = generateAuthCookie (user.id)
            return {user,cookies:[auth_cookie] }


    })
    }}
    export function generateAuthCookie(id: number): string {
        const data = {
          id: id,
        }
        const validFor = { expiresIn: "1h" }
        return jwt.sign(data, jwt_secret, validFor)
      }
    
      export function verifyAuthToken(token: string) {
        return jwt.verify(token, jwt_secret) as { userID: number }}