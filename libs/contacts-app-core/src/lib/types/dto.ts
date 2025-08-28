import { User } from "./index";

export type CreateUserDTO = Omit<User, 'id'>;
