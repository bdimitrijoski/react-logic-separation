## 🏗 Contacts App Clean Architecture

This POC explores applying **Clean Architecture** principles (as popularized by Uncle Bob) to a modern React + Preact Signals + React Query stack.

### Core Concepts

- **Separation of Concerns**  
  The codebase is divided into distinct layers:
  - **Domain Layer** – Pure business logic, independent of frameworks or infrastructure.  
    Contains entities, value objects, and use cases (commands/services).
  - **Application Layer** – Coordinates use cases, orchestrates repositories, and applies business rules.
  - **Infrastructure Layer** – Concrete implementations for APIs, persistence, and external services.

- **Dependency Rule**  
  Inner layers (domain) know nothing about outer layers (infrastructure).  
  The domain depends only on **abstractions**, never on concrete implementations.

- **Repository Pattern**  
  - The domain layer defines repository **interfaces** (e.g., `UserRepository`).
  - At runtime, the infrastructure layer injects **real implementations** (e.g., backed by React Query + API calls).
  - This allows swapping implementations (e.g., mock repos for tests) without touching domain code.

- **Commands & Services**  
  - **Commands** encapsulate a single action or use case (e.g., `CreateUserCommand`, `UpdateUserEmailCommand`). This is where you would write the domain code.
  - **Services** group related commands and queries, acting as the API for the domain logic.

- **Reactive State with Signals**  
  - Preact Signals wrap React Query results to provide a global, reactive store.
  - Collections manage cached data, handle inserts/updates/deletes, and trigger callbacks after changes.

---

### Example Flow

1. **Domain Layer**  
Pure business logic, independent of frameworks or infrastructure. Contains entities, value objects, and use cases (commands/services).
```ts
// Domain Model
type User = {
    name: string;
    email: string;
}

interface UserRepository {
    findById(id: string): Promise<User>;
    save(user: User): Promise<void>;
}
```

2. **Application Layer**  

The commands are the actual use cases. This is where the business logic lives.
The command ideally should be independent of frameworks or infrastructure.
In this example, the command depends on the `UserRepository` which is an abstraction.
The commands might use multiple repositories or services to implement the logic.

The commands should not know how the data is being fetched.

```ts
class UpdateUserEmailCommand {
    constructor(private repo: UserRepository) {}
    async execute(id: string, newEmail: string) {
    const user = await this.repo.findById(id);
    user.updateEmail(newEmail);
    await this.repo.save(user);
    }
}
```

3. **Infrastructure Layer**  

This is the layer that knows about the third-party tools and other framework dependencies.
This layer later is injected in the app via dependency injection.

The idea here is the the implementation can be easily replaced with something else
without the app knowing about.
```ts
class UserRepositoryImpl implements UserRepository {
    constructor(private collection: SignalCollection<User>) {}
    findById(id: string) { return this.collection.fetchBy(id, fetchUserApi); }
    save(user: User) { /* update via API + update cache */ }
}
```

3.1. **Collections**

The collections are inspired by tanstack-db. This is just a POC that under the hood uses react-query to keep the cache.
The idea is that you would keep the cache only on one place (like a global state) and you can manage the cache.. append data, remove/insert items.
Also you could fetch individual items from the collection and if they are not present, you could make an API call, update the collection and return the result back.
Everything would be managed from one place.

4. **Runtime Composition**  
   ```ts
   const usersCollection = new SignalCollection<User>(/* ... */);
   const userRepo = new UserRepositoryImpl(usersCollection);
   const updateUserEmail = new UpdateUserEmailCommand(userRepo);
   ```

---

### Benefits

- **Testability** – Domain logic can be tested in isolation with mock repositories.
- **Flexibility** – Swap infrastructure without touching business rules.
- **Maintainability** – Clear boundaries make it easier to evolve the system.
- **Reactivity** – Signals keep UI in sync with domain state automatically.

```
          +----------------------+
          |      Domain Layer     |
          |-----------------------|
          | Entities              |
          | Value Objects         |
          | Use Cases (Commands)  |
          | Repository Interfaces |
          +-----------▲-----------+
                      |
                      | depends on abstractions only
                      |
          +-----------▼-----------+
          |   Application Layer   |
          |-----------------------|
          | Services              |
          | Orchestration Logic   |
          +-----------▲-----------+
                      |
                      | injects real implementations
                      |
          +-----------▼-----------+
          | Infrastructure Layer  |
          |-----------------------|
          | API Clients           |
          | SignalCollection      |
          | React Query Wrappers  |
          | Repository Impl.      |
          +-----------------------+

```

**Data Flow Example:**

- UI calls a Service in the Application Layer.
- Service executes a Command that depends on a Repository Interface.
- At runtime, the Infrastructure Layer injects a Repository Implementation backed by SignalCollection + React Query.
- SignalCollection updates cache + signals, triggering reactive UI updates.