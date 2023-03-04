import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
    // retry(failureCount: number, error: AxiosError) { //@dev removing this for now
    //   if (error.code === "ERR_BAD_RESPONSE") {
    //     failureCount = 2;
    //   }
    // },
    //should be retry: 2?
  });
};
