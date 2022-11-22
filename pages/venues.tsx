import React from "react";
import { useGetVenues } from "../hooks/queries/getVenues";

export default function Venues() {
  const { data } = useGetVenues();
  console.log(data);

  //grid displaying venues
  //fuzzy search sort input
  //venue singlular page
  //pagination
  //requests to get venues in
  return <div>Venues</div>;
}
