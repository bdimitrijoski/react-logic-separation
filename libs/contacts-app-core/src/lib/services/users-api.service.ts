import { HttpClient } from '../boundaries';
import { API_URL } from '../constants';
import { User } from '../types';
import { CreateUserDTO } from '../types/dto';
import { mockUsers } from './mock-users';


export class UsersApiService {
  constructor(private httpClient: HttpClient) {}
  async fetchUsers(): Promise<User[]> {
    // return this.httpClient.get<User[]>(`${API_URL}/users`);
    return Promise.resolve(mockUsers)
  }

  async fetchUser(id: number): Promise<User> {
    return this.httpClient.get<User>(`${API_URL}/users/${id}`);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    return this.httpClient.post<CreateUserDTO, User>(`${API_URL}/users`, data);
  }

  async updateUser(user: User): Promise<User> {
    return this.httpClient.put<User, User>(`${API_URL}/users/${user.id}`, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.httpClient.delete(`${API_URL}/users/${id}`);
  }
}
