import React from "react";
import VenueCard from "../../components/VenueCard";
import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export default function Favourites() {
  const { data: venueData } = useQuery<VenueResponse>(
    ["venue_favourites"],
    () => client.get("venues/user/favourites")
  );

  return (
    <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Favourites
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Venues you enjoyed the most.
          </p>
        </div>
        <div className="mx-auto pt-6 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {venueData?.data &&
            venueData.data.data.map((venue: Venue, key: number) => {
              return <VenueCard venue={venue} />;
            })}
        </div>
      </div>
    </div>
  );
}
