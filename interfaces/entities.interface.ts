
export type IDefault = {
    id: number
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
  }

  export type IUser = {
    name:string;
    email:string;
    password:string;
    refresh_token:string;

    todos:ITodo[]
  } & IDefault


  export type ITodo = {
  title:string;
  descrption:string
  is_done:boolean
  user: IUser
  } & IDefault