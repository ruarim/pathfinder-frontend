import clsx from "clsx";
import { MapPinIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import timeFormatter from "../../../helpers/timeFormatter";

interface VenueMapCardProps {
  venue: Venue;
}

export default function VenueMapCard({ venue }: VenueMapCardProps) {
  const avg_rating = venue?.rating;

  return (
    <div
      key={venue.name}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      <div className="flex-shrink-0">
        <img
          className="h-32 w-full object-cover"
          src={venue.images[0] ?? "/pub-placeholder.jpg"}
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <div className="flex justify-between text-xl font-medium text-primary">
            <Link
              target="_blank"
              href={`/venues/${venue.id}`}
              className="hover:underline"
            >
              {venue.name}
            </Link>
            <div className="flex">
              <div className="pt-1 pl-2 flex">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={clsx(
                      avg_rating > rating ? "text-yellow-400" : "text-gray-300",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-lg">({avg_rating})</div>
            </div>
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
        </div>
        <div className="mt-1 flex items-center pt-1">
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col text-sm text-primary pt-1">
              <time dateTime={venue.opening_time}>
                Opening Time {timeFormatter(venue.opening_time)}
              </time>
              <time dateTime={venue.closing_time}>
                Closing Time {timeFormatter(venue.closing_time)}
              </time>
            </div>
            <div className="bg-red-200 rounded-full flex items-center justify-center w-11">
              <MapPinIcon className="w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
