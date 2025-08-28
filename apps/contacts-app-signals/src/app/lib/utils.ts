import * as uuid from "uuid";
import { QueryClient, QueryKey } from "@tanstack/query-core";

export async function sleep(timeInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

export function generateId() {
  return uuid.v4();
}

export function noop() {}

export function updateQueryData<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updatedValue: T
) {
  queryClient.setQueryData(queryKey, updatedValue);
}