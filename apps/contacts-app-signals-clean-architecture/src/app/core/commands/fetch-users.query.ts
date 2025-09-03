import { DraftVersionsService, User } from "contacts-app-core";
import { IUsersRepository } from "../repositories";

export class FetchUsersQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftVersionsService: DraftVersionsService
  ) {}

  async execute(searchQuery?: string): Promise<User[]> {
    console.log('FetchUsersQuery execute called', searchQuery);
    
      const drafts = this.draftVersionsService.getAllDraftsSync();
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

      console.log('Combined list:', combinedList);
      return combinedList;

  }
}