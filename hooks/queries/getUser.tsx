import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useAuthContext } from "../context/useAuthContext";

interface UserDto {
  username: string;
  email: string;
  id: string;
}

export const useGetUser = () => {
  const { isLoggedIn } = useAuthContext();

  return useQuery<UserDto, any, UserResponse>({
    queryKey: ["user"],
    queryFn: (): Promise<UserDto> => client.get("user"),
    enabled: isLoggedIn,
  });
};
