import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenues = () => {
  return useQuery<unkown, unkown, unkown>({
    queryFn: () => client.get("venues"),
  });
};
