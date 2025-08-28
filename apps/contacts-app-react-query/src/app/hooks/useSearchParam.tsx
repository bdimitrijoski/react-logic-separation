import { useParams } from "react-router-dom";

export const useSelectedUserId = () => {
    // retrieve the selected user from path params
    const { userId } = useParams<{ userId: string }>();

  return userId;
}