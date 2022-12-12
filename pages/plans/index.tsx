import { BaseSyntheticEvent, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import VenueMapCard from "../../components/VenueMapCard";
import Map, { Marker } from "react-map-gl";

export default function Plans() {
  const [attributesParams, setAttributesParams] = useState<string[]>([]);
  const [isPathModalOpen, setPathModalOpen] = useState(true);
  const [venuesPath, setVenuesPath] = useState<string[]>([]);
  const { data: attributesData } = useGetAttributes();
  const { data: venuesData, isLoading: venuesLoading } =
    useGetVenuesByAttributes(attributesParams);

  const addParam = (e: BaseSyntheticEvent) => {
    let value = e.target.innerText;
    let params = attributesParams;

    if (params.includes(value)) {
      const index = params.indexOf(value);
      params.splice(index, 1);
    } else params?.push(value);
    setAttributesParams([...params]);
  };

  const toggleVenueInPath = (venue: string) => {
    let path = venuesPath;
    if (path.includes(venue)) {
      const index = path.indexOf(venue);
      path.splice(index, 1);
    } else path.push(venue);
    setVenuesPath([...path]);
  };

  //@dev get from users current location
  const lat = 51.47513029807826;
  const long = -2.591221556113587;

  return (
    <div className="mx-auto overflow-hidden">
      <div className="absolute">
        {attributesData?.data && (
          <div className="bg-white drop-shadow-lg p-5 m-3 space-y-5 rounded-md">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-medium text-gray-900">
                Plan your path
              </h2>
              {isPathModalOpen ? (
                <div
                  onClick={() => setPathModalOpen(false)}
                  className="hover:animate-pulse"
                >
                  {ModalOpenArrow}
                </div>
              ) : (
                <div
                  onClick={() => setPathModalOpen(true)}
                  className="hover:animate-pulse rotate-180"
                >
                  {ModalOpenArrow}
                </div>
              )}
            </div>

            {isPathModalOpen && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <TextInput
                    label={"Start"}
                    placeholder={"Choose a starting point"}
                  />
                  <TextInput label={"End"} placeholder={"Choose an endpoint"} />
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Pick some attributes
                  </div>
                  <div className="grid grid-cols-4 w-full gap-2">
                    {attributesData?.data.data.map((attribute: string) => {
                      return (
                        <button
                          onClick={(e) => addParam(e)}
                          className={clsx(
                            "p-2 w-full mb-2 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-md",
                            attributesParams.includes(attribute) &&
                              "bg-gray-300"
                          )}
                          key={attribute}
                        >
                          {attribute}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setAttributesParams([])}
                    className="p-2 mt-2 w-full rounded-lg bg-red-300 transition hover:bg-red-400"
                  >
                    Clear attributes
                  </button>
                </div>
                <div className="border bg-gray-200 border-gray-200 rounded-lg"></div>
                {venuesPath.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg">Path</h3>
                    <div className="space-y-2">
                      {venuesPath?.map((name) => {
                        return (
                          <div
                            key={name}
                            className="flex justify-between bg-gray-200 p-2 rounded-md"
                          >
                            {name}
                            <button onClick={() => toggleVenueInPath(name)}>
                              {Cross}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button className="p-2 w-full rounded-lg bg-blue-300 transition hover:bg-blue-400">
                      Save path
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css"
        rel="stylesheet"
      />
      <Map
        initialViewState={{
          latitude: lat,
          longitude: long,
          zoom: 14,
          bearing: 0,
          pitch: 0,
        }}
        style={{ height: "94%", position: "absolute", zIndex: -1 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
      >
        {venuesData?.data?.data
          ?.sort(
            (first: Venue, second: Venue) =>
              second.address.longitude - first.address.longitude
          )
          .map((venue: Venue) => {
            return (
              <Marker
                key={venue.id}
                latitude={venue.address.latitude}
                longitude={venue.address.longitude}
                anchor="bottom"
              >
                <VenueMapCard
                  key={venue.id}
                  venue={venue}
                  venuesPath={venuesPath}
                  toggleVenueInPath={toggleVenueInPath}
                />
              </Marker>
            );
          })}
      </Map>
    </div>
  );
}

interface TextInputProps {
  placeholder: string;
  label: string;
}
function TextInput({ label, placeholder }: TextInputProps) {
  return (
    <div>
      <label
        htmlFor="name"
        className="ml-px block pl-4 text-lg font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full rounded-full bg-gray-200 p-3 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

const ModalOpenArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const Cross = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
