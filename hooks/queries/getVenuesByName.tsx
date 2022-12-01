import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenuesByName = (searchParam: string) => {
  return useQuery<VenueResponse, any, any>({
    queryKey: ["searchParam", searchParam],
    queryFn: () => client.get(`name_search?name=${searchParam}`),
  });
};
