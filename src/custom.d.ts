declare namespace Express {
  export interface Request {
    body: {
      roles: string[],
      username: string,
      password: string,
    },
    session: {
      token: string
    },
    params: {
      id: number
    }
    userId: number,
    ownerId: number,
  }
  export interface Response {
    customProperty: string
  }
}
