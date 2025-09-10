import { createContext, PropsWithChildren } from "react";
import { User } from "../types";

export interface UsersListViewModelHookResult {
    users: User[];
    isLoading?: boolean;
    search: string;
    selectedUserId?: string;
    setSearch: (value: string) => void;
    createNewDraftUser: () => void;
    deleteUser?: (user: User) => void;
    loadMore?: (page: number) => void;
}
export type useUsersListViewModelHook = () => UsersListViewModelHookResult;

export interface ListPanelContextInterface {
  useUsersListViewModel: useUsersListViewModelHook;
}

export const ListPanelContext = createContext<ListPanelContextInterface>({} as ListPanelContextInterface);

export const ListPanelContextProvider: React.FC<PropsWithChildren<ListPanelContextInterface>> = ({ children, ...props }) => {
  return <ListPanelContext.Provider value={props}>{children}</ListPanelContext.Provider>;
};