import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetAttributes = () => {
  return useQuery<any, any, string[]>({
    queryKey: ["attributes"],
    queryFn: () => client.get("attributes"),
  });
};
