import { useState } from "react";
import timeFormatter from "../helpers/timeFormatter";

interface VenueMapCardProps {
  venue: Venue;
}

export default function VenueMapCard({ venue }: VenueMapCardProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      {isOpen && (
        <div className=" -z-10" onClick={() => setOpen(true)}>
          <div
            key={venue.name}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
          >
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={"/pub-placeholder.jpg"}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <p className="text-xl font-medium text-primary">
                  <a href={`venues/${venue.id}`} className="hover:underline">
                    {venue.name}
                  </a>
                </p>
                <a href={`venues/${venue.id}`} className="mt-2 block">
                  <p className="mt-3 text-primary text-lg">Address</p>
                  <p className="text-primary text-sm">
                    {venue.address.address_1}
                  </p>
                  <p className="text-primary text-sm">
                    {venue.address?.address_2}
                  </p>
                  <p className="text-primary text-sm">
                    {venue.address.town_city}
                  </p>
                  <p className="text-primary text-sm">
                    {venue.address.postcode}
                  </p>
                  <p className="text-primary text-sm">
                    {venue.address.country}
                  </p>
                </a>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <a href={venue.address.address_1}>
                    <span className="sr-only">{venue?.address?.address_2}</span>
                  </a>
                </div>

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
        </div>
      )}
      <div
        className="flex justify-center"
        onClick={() => (isOpen ? setOpen(false) : setOpen(true))}
      >
        {Pin}
      </div>
    </div>
  );
}

const Pin = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
