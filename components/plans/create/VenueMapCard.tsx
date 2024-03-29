import clsx from "clsx";
import { MapPinIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { pinColours } from "../../../pages/plans/create";

interface VenueMapCardProps {
  venue: Venue;
  index: number;
}

export default function VenueMapCard({ venue, index }: VenueMapCardProps) {
  const avgRating = venue?.rating;
  const maxAttributes = 4;
  return (
    <div
      key={venue.name}
      className="flex flex-col overflow-hidden rounded-lg shadow-md mb-1"
    >
      <div className="flex-shrink-0">
        <img
          className="h-32 w-full object-cover"
          src={venue.images[0] ?? "/pub-placeholder.jpg"}
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white px-6 py-4">
        <div className="flex-1">
          <div className="flex justify-between text-md font-medium text-primary">
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
                      avgRating > rating ? "text-yellow-400" : "text-gray-300",
                      "h-4 w-4 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-md">({avgRating})</div>
            </div>
          </div>
          <div className="space-y-1 mt-1 truncate ...">
            {venue?.attributes?.map((attribute, i) => {
              if (i > maxAttributes) return <></>;
              if (i == maxAttributes)
                return (
                  <div
                    key={attribute}
                    className="bg-teal-400 text-white p-2 rounded-md space-x-1 text-xs font-medium inline-flex mr-1"
                  >
                    <div>...</div>
                  </div>
                );
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
              <time dateTime={venue.hours}>
                {venue.hours.split(";").map((time) => (
                  <div>{time}</div>
                ))}
              </time>
            </div>
            <div className="flex items-center">
              <div
                className={`${pinColours[index][1]} h-12 rounded-full flex items-center justify-center w-12`}
              >
                <MapPinIcon className={`w-8 ${pinColours[index][0]}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
