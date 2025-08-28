export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  // ...other JSONPlaceholder fields
}

export interface Page<T> {
  items: T[];
  nextPage?: number;
  prevPage?: number;
}

export interface Version<T> {
  id: string;           // e.g. timestamp or UUID
  data: T;
  timestamp: number;
  isDraft: boolean;
}
