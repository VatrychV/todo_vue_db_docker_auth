import dotenv from "dotenv"

dotenv.config()

interface IConfig {
  SERVER: { PORT: number; NODE_TYPE: string; DOMAIN: string }
  DB: {
    PORT: number
    HOST: string
    USER: string
    DB_NAME: string
    USER_PASS: string
  }
  JWT: {
    SECRET: string
    EXPIRE_TIME: number
  }
}

const config: IConfig = {
  SERVER: {
    DOMAIN: process.env.DOMAIN!,
    NODE_TYPE: process.env.NODE_TYPE!,
    PORT: Number(process.env.PORT!),
  },
  DB: {
    PORT: Number(process.env.DB_PORT!),
    HOST: process.env.DB_HOST!,
    USER: process.env.DB_USER!,
    DB_NAME: process.env.DB_NAME!,
    USER_PASS: process.env.DB_USER_PASS!,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET!,
    EXPIRE_TIME: Number(process.env.EXPIRE_TIME!),
  },
}

export default config
