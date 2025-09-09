import { User, UserVersion } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

export class FetchUsersQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftRepository: IDraftsRepository
  ) {}

  async execute(searchQuery?: string, page = 1): Promise<User[]> {
    console.log('FetchUsersQuery execute called', searchQuery, page);
    
    
      // const drafts = this.draftsService.getAllDraftsSync();
      const drafts = await this.draftRepository.getAll();
      // const drafts = [] as UserVersion[];
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

      console.log('Combined list:', combinedList);
      return combinedList;

  }
}