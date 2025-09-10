import { User } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

export class FetchUsersQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftRepository: IDraftsRepository
  ) {}

  async execute(searchQuery?: string, page = 1): Promise<User[]> {
      const drafts = await this.draftRepository.getAll();
      const users = await this.usersRepository.getAll();

      let combinedList: User[] = [
        ...users,
        ...(drafts.map((draft) => draft.data) || []),
      ];

      if(searchQuery){
        combinedList = combinedList.filter((user) =>
          user.name.toLocaleLowerCase().startsWith(searchQuery.toLocaleLowerCase())
        );
      }

      const limit = 5;
      combinedList = combinedList.splice(0, page * limit );

      // combined list can have duplicates if a user has a draft version
      // get the latest version (draft) in that case
      const uniqueMap = new Map<number, User>();
      combinedList.forEach((user) => {
        uniqueMap.set(user.id, user);
      });
      combinedList = Array.from(uniqueMap.values());
      return combinedList;

  }
}