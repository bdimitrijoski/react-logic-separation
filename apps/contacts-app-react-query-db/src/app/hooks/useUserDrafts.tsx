import { eq, useLiveQuery } from "@tanstack/react-db";
import { draftsCollection } from "../collections/draftsCollection";

export const useUserDrafts = (userId: number) => {
  // 2. Live fetch drafts for the user
  const { data: drafts, isLoading, isError } = useLiveQuery(
    (q) =>
      q
        .from({ draft: draftsCollection })
        .where(({ draft }) => eq(draft.data.id, userId))
        .select(({ draft }) => ({ ...draft })),
    [userId]
  );

  return {
    drafts: drafts || [],
    isLoading,
    isError,
  };
}