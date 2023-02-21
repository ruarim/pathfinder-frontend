import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useMap } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetMapBoxLocations = (searchText: string) => {
  return useQuery<MapLocations>({
    queryKey: ["location_search", searchText],
    queryFn: () =>
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}`
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
}

export default function MapSearch({
  label,
  placeholder,
  selected,
  setSelected,
}: MapSearchProps) {
  const [query, setQuery] = useState<string>("");

  const { data: locations } = useGetMapBoxLocations(query); //@dev useDebounce
  const { map } = useMap();

  const onChange = (location: any) => {
    setSelected(location);
    if (map) map.flyTo({ center: [location.center[0], location.center[1]] });
  };

  return (
    <div className="top-16">
      <Combobox value={selected.place_name} onChange={onChange}>
        <div className="mt-1">
          <label
            htmlFor="input"
            className="ml-px block pl-4 text-lg font-medium text-gray-700"
          >
            {label}
          </label>
          <Combobox.Input
            id="input"
            className="block w-full rounded-full bg-gray-200 p-3 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />

          {/* fix css weirdness */}
          {/* <div className="absolute right-7 flex items-center">
            <MagnifyingGlassIcon className="text-gray-400 w-5" />
          </div> */}

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-11/12 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {locations?.data?.features.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                locations?.data?.features.map((location) => {
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
