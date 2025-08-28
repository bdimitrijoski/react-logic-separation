import { createContext, PropsWithChildren } from "react";
import { User, UserVersion } from "../types";

export interface UserDetailsViewModelHookResult {
    versions: UserVersion[];
    selectedId: string;
    setSelectedId: (id: string) => void;
    isLoading: boolean;
    isError: boolean;
    current?: User;
    startEdit: () => void;
    onChangeField: (field: keyof User, value: string) => void;
    onPublish: () => void;
    onDiscard: () => void;
  }
export type useUserDetailsViewModelHook = (userId: number) => UserDetailsViewModelHookResult;

export interface DetailsPanelContextInterface {
  useUserDetailsViewModel: useUserDetailsViewModelHook;
}

export const DetailsPanelContext = createContext<DetailsPanelContextInterface>({} as DetailsPanelContextInterface);

export const DetailsPanelContextProvider: React.FC<PropsWithChildren<DetailsPanelContextInterface>> = ({ children, ...props }) => {
  return <DetailsPanelContext.Provider value={props}>{children}</DetailsPanelContext.Provider>;
};