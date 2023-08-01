import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useMap } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMapBoxLocations = (
  searchText: string,
  userLocation: LatLong
) => {
  return useQuery<MapLocations>({
    queryKey: ["location_search", searchText],
    queryFn: () =>
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?proximity=${userLocation.long},${userLocation.lat}&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}`
      ),
  });
};

export type MapLocations = {
  data: {
    features: MapLocation[];
  };
};

interface MapSearchProps {
  label: string;
  placeholder: string;
  setSelected: (location: MapLocation) => void;
  selected: MapLocation;
  userLocation: LatLong;
  hasUserLocation: boolean;
}

export default function MapSearch({
  label,
  placeholder,
  selected,
  setSelected,
  userLocation,
  hasUserLocation,
}: MapSearchProps) {
  const [query, setQuery] = useState<string>("");

  const { data: locationsData } = useGetMapBoxLocations(query, userLocation); //@dev useDebounce
  const { map } = useMap();

  const onChange = (location: MapLocation) => {
    setSelected(location);
    flyTo(location.center[0], location.center[1]);
  };

  const locations = locationsData?.data?.features;

  const selectCurrentLocation = () => {
    const lat = userLocation.lat;
    const long = userLocation.long;

    setSelected({
      place_name: "Current Location",
      center: [long, lat],
    });
    flyTo(long, lat);
  };

  const flyTo = (long: number, lat: number) => {
    if (map) map.flyTo({ center: [long, lat], zoom: 14 });
  };

  return (
    <div className="top-16">
      <Combobox<string | MapLocation>
        value={selected.place_name}
        onChange={onChange}
      >
        <div>
          <label
            htmlFor="input"
            className="ml-px block text-md font-medium text-gray-700"
          >
            {label}
          </label>
          <div className="flex space-x-2">
            <Combobox.Input
              id="input"
              className="block w-full rounded-full bg-gray-200 p-2 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              onClick={() =>
                setSelected({
                  place_name: "",
                  center: [0, 0],
                })
              }
              className="absolute right-[75px] pt-2 w-6 text-gray-700"
            >
              <XMarkIcon className="bg-gray-300 rounded-full hover:bg-gray-400" />
            </button>
            {/* disable if user locaion is default */}
            <button
              disabled={hasUserLocation}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={selectCurrentLocation}
            >
              <CurrentLocationIcon />
            </button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-11/12 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
              {locations && locations.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                locations &&
                locations.map((location) => {
                  const splitPlacename = location.place_name.split(",");

                  return (
                    <Combobox.Option
                      key={location.place_name}
                      className={({ active }) =>
                        `cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={location}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`
                           block truncate ${
                             selected ? "font-medium" : "font-normal"
                           }`}
                          >
                            {splitPlacename[1]
                              ? `${splitPlacename[0]}, ${splitPlacename[1]}`
                              : splitPlacename[0]}
                          </span>
                          {selected ? (
                            <span
                              className={`inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            ></span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

const CurrentLocationIcon = () => (
  <div className="border-2 border-gray-200 bg-gray-100 rounded-md hover:bg-gray-200 px-1.5">
    <div className="w-6 py-1.5  ">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 122.88 122.88"
      >
        <g>
          <path d="M68.23,13.49c10.44,1.49,19.79,6.36,26.91,13.48c7.29,7.29,12.23,16.93,13.58,27.68h14.17v13.58h-14.39 c-1.62,10.13-6.42,19.2-13.36,26.13c-7.11,7.11-16.47,11.99-26.91,13.48v15.04H54.65v-15.04c-10.44-1.49-19.79-6.36-26.9-13.48 c-6.94-6.94-11.74-16-13.36-26.13H0V54.65h14.16c1.35-10.75,6.29-20.39,13.58-27.68c7.11-7.11,16.46-11.99,26.9-13.48V0h13.58 V13.49L68.23,13.49z M61.44,35.41c13.95,0,25.25,11.31,25.25,25.25c0,13.95-11.31,25.25-25.25,25.25 c-13.95,0-25.25-11.31-25.25-25.25C36.19,46.72,47.49,35.41,61.44,35.41L61.44,35.41z M89,33.11c-7.05-7.05-16.8-11.42-27.56-11.42 c-10.76,0-20.51,4.36-27.56,11.42c-7.05,7.05-11.42,16.8-11.42,27.56c0,10.76,4.36,20.51,11.42,27.56 c7.05,7.05,16.8,11.42,27.56,11.42c10.76,0,20.51-4.36,27.56-11.42c7.05-7.05,11.42-16.8,11.42-27.56 C100.41,49.9,96.05,40.16,89,33.11L89,33.11z" />
        </g>
      </svg>
    </div>
  </div>
);
