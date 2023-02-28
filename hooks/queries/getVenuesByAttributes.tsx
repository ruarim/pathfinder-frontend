import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetVenuesByAttributes = (attributes: string[]) => {
  const searchParam = formatArrayAsString(attributes);

  return useQuery<VenueResponse, any, any>({
    queryKey: ["attributes_venues", searchParam],
    queryFn: () => client.get(`attributes_search?${searchParam}`),
  });
};

function formatArrayAsString(attributes: string[]) {
  let searchParam = "";
  for (const a of attributes) {
    searchParam += `attributes[]=${a}&`;
  }
  return searchParam;
}
