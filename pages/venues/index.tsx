import React from "react";
import { useGetVenues } from "../../hooks/queries/getVenues";
import dayjs from "dayjs";
import timeFormatter from "../../helpers/timeFormatter";

export default function Venues() {
  const { data: venueData } = useGetVenues();
  console.log(venueData?.data?.data);

  //grid displaying venues
  //fuzzy search sort input
  //venue singlular page
  //pagination
  //requests to get venues in
  return (
    <div className="relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Venues
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Search through to find the perfect spot.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {venueData &&
            venueData.data.data.map((venue) => {
              return (
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
                      <p className="text-sm font-medium text-indigo-600">
                        <a
                          href={`venues/${venue.id}`}
                          className="hover:underline"
                        >
                          {venue.name}
                        </a>
                      </p>
                      <a href={`venues/${venue.id}`} className="mt-2 block">
                        <p className="text-xl font-semibold text-gray-900">
                          {venue.name}
                        </p>
                        <p className="mt-3 text-base text-gray-500">Address</p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <a href={venue.address.address_1}>
                          <span className="sr-only">
                            {venue?.address?.address_2}
                          </span>
                        </a>
                      </div>
                      <div className="ml-3">
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
              );
            })}
        </div>
      </div>
    </div>
  );
}
