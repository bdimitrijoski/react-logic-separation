import { useParams } from "react-router-dom";

export const useSelectedUserId = () => {
    // retrieve the selected user from path params
    const { userId } = useParams<{ userId: string }>();

  return userId;
}
export const useSelectedVersion = () => {
    // retrieve the selected user from path params
    const { version } = useParams<{ version: string }>();

  return version;
}