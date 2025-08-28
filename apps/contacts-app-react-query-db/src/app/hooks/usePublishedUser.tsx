import { eq, useLiveQuery } from "@tanstack/react-db";
import { usersCollection } from "../collections/usersCollection";

export const usePublishedUser = (userId: number) => {
  // 1. Live fetch server user
    const { data, isLoading, isError } = useLiveQuery(
      (q) =>
        q
          .from({ users: usersCollection })
          .where(({ users }) => eq(users.id, userId))
          .select(({ users }) => ({...users})),
      [userId]
    );

    return {
        user: data[0] || null,
        isLoading,
        isError
    }
}