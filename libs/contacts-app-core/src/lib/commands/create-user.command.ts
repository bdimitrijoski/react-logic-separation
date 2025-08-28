import { UsersApiService } from "../services/users-api.service";
import { User } from "../types";

interface CreateUserCommandDTO {
    user: User;
}
export class CreateUserCommand {
  constructor(public usersApiService: UsersApiService) {}

  async execute(dto: CreateUserCommandDTO): Promise<User> {
    return this.usersApiService.createUser(dto.user);
  }
}