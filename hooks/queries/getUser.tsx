import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import client from "../../axios/apiClient";

interface UserDto {
  username: string;
  email: string;
  id: string;
}

export const useGetUser = () => {
  return useQuery<UserDto, any, Error>({
    queryKey: ["user"],
    queryFn: (): Promise<UserDto> => client.get("user"),
    // retry(failureCount: number, error: AxiosError) { //@dev removing this for now
    //   if (error.code === "ERR_BAD_RESPONSE") {
    //     failureCount = 2;
    //   }
    // },
    //should be retry: 2?
  });
};
