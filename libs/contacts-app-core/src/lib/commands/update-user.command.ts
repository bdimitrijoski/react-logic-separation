import { UsersApiService } from "../services/users-api.service";
import { User } from "../types";

interface UpdateUserCommandDTO {
    user: User;
}
export class UpdateUserCommand {
  constructor(public usersApiService: UsersApiService) {}

  async execute(dto: UpdateUserCommandDTO): Promise<User> {
    return this.usersApiService.updateUser(dto.user);
  }
}