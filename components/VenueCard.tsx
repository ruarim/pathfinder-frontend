import { StarIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Link from "next/link";
import timeFormatter from "../helpers/timeFormatter";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const avg_rating = venue?.rating == undefined ? 0 : venue?.rating;

  return (
    <div
      key={venue.name}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      <div className="flex-shrink-0">
        <img
          className="h-48 w-full object-cover"
          src={venue.images[0] ?? "/pub-placeholder.jpg"}
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <p className="flex justify-between text-xl font-medium text-primary">
            <Link href={`/venues/${venue.id}`} className="hover:underline">
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
          </p>
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
          <Link href={`venues/${venue.id}`} className="mt-2 block">
            <h3 className="mt-3 text-primary text-lg">Address</h3>
            <p className="text-primary text-sm">{venue.address.address_1}</p>
            <p className="text-primary text-sm">{venue.address?.address_2}</p>
            <p className="text-primary text-sm">{venue.address.town_city}</p>
            <p className="text-primary text-sm">{venue.address.postcode}</p>
            <p className="text-primary text-sm">{venue.address.country}</p>
          </Link>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <Link href={venue.address.address_1}>
              <span className="sr-only">{venue?.address?.address_2}</span>
            </Link>
          </div>

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
  );
}
