import { useState } from "react";
import timeFormatter from "../helpers/timeFormatter";
import clsx from "clsx";

interface VenueMapCardProps {
  venue: Venue;
  venuesPath: string[];
  toggleVenueInPath: (venue: string) => void;
}

export default function VenueMapCard({
  venue,
  venuesPath,
  toggleVenueInPath,
}: VenueMapCardProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      {isOpen && (
        <div onClick={() => setOpen(true)}>
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                {venue?.attributes?.map((attribute) => {
                  return (
                    <div
                      key={attribute}
                      className="bg-blue-100 p-2 rounded-md flex space-x-1"
                    >
                      <div>{Tag}</div>
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
          {!venuesPath.includes(venue.name) ? (
            <button
              onClick={() => toggleVenueInPath(venue.name)}
              className="p-2 mt-2 w-full rounded-lg bg-blue-300 transition hover:bg-blue-400 text-lg"
            >
              Add to path
            </button>
          ) : (
            <button
              onClick={() => toggleVenueInPath(venue.name)}
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
          venuesPath.includes(venue.name) && "text-blue-400"
        )}
        onClick={() => (isOpen ? setOpen(false) : setOpen(true))}
        //onMouseOver={() => (isOpen ? setOpen(false) : setOpen(true))}
      >
        {Pin}
      </div>
    </div>
  );
}

const Pin = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const Tag = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6h.008v.008H6V6z"
    />
  </svg>
);
