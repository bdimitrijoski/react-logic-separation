import { User, UserVersion } from "./index";

export type CreateUserDTO = Omit<User, 'id'>;

export type FetchUserQueryResult = {
  publishedUser: User | undefined;
  userVersions: UserVersion[];
}