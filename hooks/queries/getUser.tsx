import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetUser = () => {
  return useQuery<any, any, any>({
    queryKey: ["user"],
    queryFn: () => client.get("user"),
  });
};
