import VenueCard from "../../components/VenueCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export default function Venues() {
  const { data: venueData, isLoading: venuesLoading } = useQuery<
    unknown,
    unknown,
    VenuesResponse
  >(["admin_venues"], () => client.get("venues/admin/all"));

  const venues = venueData?.data.data;

  return (
    <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Venues
          </h2>
          {venues?.length !== 0 ? (
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              These are your venues.
            </p>
          ) : (
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              You haven't created any venues yet.
            </p>
          )}
        </div>
        {!venuesLoading ? (
          <div className="mx-auto pt-6 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {venues &&
              venues.map((venue: Venue, key: number) => {
                return <VenueCard venue={venue} key={key} />;
              })}
          </div>
        ) : (
          <div className="text-black flex justify-center p-24">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
