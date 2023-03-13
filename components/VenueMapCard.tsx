import { useState } from "react";
import timeFormatter from "../helpers/timeFormatter";
import clsx from "clsx";
import { useMap } from "react-map-gl";
import { MapPinIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface VenueMapCardProps {
  venue: Venue;
  venuesPlan: Venue[];
  toggleVenueInPlan: (venue: Venue) => void;
  latLong: LatLong;
}

export default function VenueMapCard({
  venue,
  venuesPlan,
  toggleVenueInPlan,
  latLong,
}: VenueMapCardProps) {
  const [isOpen, setOpen] = useState(false);
  const { current: map } = useMap();
  const avg_rating = venue?.rating;

  return (
    <div>
      {isOpen && (
        <div onClick={() => setOpen(true)} className="w-64">
          <div
            key={venue.name}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div className="flex-shrink-0">
              <img
                className="h-32 w-full object-cover"
                src={venue.images[0]}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-3">
              <div className="flex-1">
                <p className="text-xl font-medium text-primary flex justify-between">
                  <Link
                    target="_blank"
                    href={`/venues/${venue.id}`}
                    className="hover:underline"
                  >
                    {venue.name}
                  </Link>
                  <div className="pt-1 pl-2 flex">
                    <div className="pt-1 pl-2 flex">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={clsx(
                            avg_rating > rating
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </p>
              </div>
              <div className="space-y-1 mt-1">
                {venue?.attributes?.map((attribute) => {
                  return (
                    <div
                      key={attribute}
                      className="bg-teal-400 text-white p-2 rounded-md space-x-1 text-xs font-medium inline-flex mr-1"
                    >
                      <div>{attribute}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center">
                <p className="text-sm font-medium text-gray-900">
                  <a
                    href={`venues/${venue.id}`}
                    className="hover:underline"
                  ></a>
                </p>
                <div className="flex flex-col text-sm text-primary">
                  <time dateTime={venue.opening_time}>
                    Opening Time {timeFormatter(venue.opening_time)}
                  </time>
                  <time dateTime={venue.closing_time}>
                    Closing Time {timeFormatter(venue.closing_time)}
                  </time>
                </div>
              </div>
            </div>
          </div>
          {!isVenueInPlan(venue, venuesPlan) ? (
            <button
              onClick={() => toggleVenueInPlan(venue)}
              className="p-2 mt-2 w-full rounded-lg bg-blue-500 transition hover:bg-blue-600 text-lg text-gray-100"
            >
              Add to plan
            </button>
          ) : (
            <button
              onClick={() => toggleVenueInPlan(venue)}
              className="p-2 mt-2 w-full rounded-lg bg-red-500 transition hover:bg-red-600 text-lg text-gray-100"
            >
              Remove
            </button>
          )}
        </div>
      )}
      <div
        className={`flex justify-center ${clsx(
          isVenueInPlan(venue, venuesPlan) ? "text-blue-400" : "text-red-400"
        )}`}
        onClick={() => {
          isOpen ? setOpen(false) : setOpen(true);
          if (!isOpen && map)
            map.flyTo({ center: [latLong.long, latLong.lat] });
        }}
      >
        <MapPinIcon className="w-8" />
      </div>
    </div>
  );
}

function isVenueInPlan(venue: Venue, venues: Venue[]) {
  return venues.find((v) => v.id === venue.id);
}
