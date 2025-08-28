import {
  IDraftsRepository,
  IUsersRepository,
} from '../boundaries/repositories';
import { QueryResult, User } from '../types';

export class SearchUsersCommand {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsRepository: IDraftsRepository
  ) {}

  async execute(searchQuery: string): Promise<QueryResult<User[]> > {
    const serverUsers = await this.usersRepository.searchUsers(searchQuery);
    const drafts = await this.draftsRepository.getAllDrafts();
    // 3. Merge new drafts at top, then live users
    const combinedList: User[] = [...(drafts.data || []).map((d) => d.data), ...(serverUsers.data || [])];

    return {
      data: combinedList,
      isLoading: serverUsers.isLoading || drafts.isLoading,
      isError: serverUsers.isError || drafts.isError,
    };
  }
}
