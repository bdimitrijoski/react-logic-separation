export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export interface UserVersion {
  id: string;         // UUID or timestamp
  data: User;
  timestamp: number;
  isDraft: boolean;
}


export type QueryResult<T> = {
  data: T | undefined
  isLoading: boolean
  isError: boolean
}