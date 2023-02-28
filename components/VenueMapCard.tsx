import { useState } from "react";
import timeFormatter from "../helpers/timeFormatter";
import clsx from "clsx";
import { useMap } from "react-map-gl";
import { TagIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/20/solid";

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
                src={"/pub-placeholder.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-3">
              <div className="flex-1">
                <p className="text-xl font-medium text-primary">
                  <a href={`venues/${venue.id}`} className="hover:underline">
                    {venue.name}
                  </a>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {venue?.attributes?.map((attribute) => {
                  return (
                    <div
                      key={attribute}
                      className="bg-blue-100 p-2 rounded-md flex space-x-1 text-xs "
                    >
                      <TagIcon className="w-5" />
                      <div>{attribute}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center">
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
              className="p-2 mt-2 w-full rounded-lg bg-blue-300 transition hover:bg-blue-400 text-lg"
            >
              Add to path
            </button>
          ) : (
            <button
              onClick={() => toggleVenueInPlan(venue)}
              className="p-2 mt-2 w-full rounded-lg bg-red-300 transition hover:bg-red-400 text-lg"
            >
              Remove
            </button>
          )}
        </div>
      )}
      <div
        className={clsx(
          "flex justify-center text-red-400",
          isVenueInPlan(venue, venuesPlan) && "text-blue-400"
        )}
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
