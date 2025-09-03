import { User, UserVersion } from "contacts-app-core";

export type FetchUserQueryResult = {
  publishedUser: User | undefined;
  userVersions: UserVersion[];
}