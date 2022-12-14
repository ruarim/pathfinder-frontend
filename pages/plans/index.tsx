import { BaseSyntheticEvent, useState } from "react";
import {
  useGetAttributes,
  useGetMapBoxLocations,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import VenueMapCard from "../../components/VenueMapCard";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  MapRef,
  MapProvider,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapSearch from "../../components/MapSearch";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

export default function Plans() {
  const [attributesParams, setAttributesSearchParams] = useState<string[]>([]);
  const [isPathModalOpen, setPathModalOpen] = useState(true);
  const [venuesPath, setVenuesPath] = useState<string[]>([]);
  const [centerPoint, setCenterPoint] = useState<latLong>({
    lat: 51.47513029807826,
    long: -2.591221556113587, //use geoLoacation from browser
  }); //@dev create helper to initalise to browser default location
  const [selectedStart, setSelectedStart] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });
  const [selectedEnd, setSelectedEnd] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });

  //@dev create map ref instance to pass down to components

  const { data: attributes } = useGetAttributes();
  const { data: venues } = useGetVenuesByAttributes(attributesParams);

  const toggleVenueAttribute = (e: BaseSyntheticEvent) => {
    let value = e.target.innerText;
    let params = attributesParams;

    if (params.includes(value)) {
      const index = params.indexOf(value);
      params.splice(index, 1);
    } else params?.push(value);
    setAttributesSearchParams([...params]); //this could probably be refactored
  };

  const toggleVenueInPath = (venue: string) => {
    let path = venuesPath;
    if (path.includes(venue)) {
      const index = path.indexOf(venue);
      path.splice(index, 1);
    } else path.push(venue);
    setVenuesPath([...path]); //this also
  };

  return (
    <MapProvider>
      <div className="mx-auto">
        {/* create path modal */}
        {attributes?.data && (
          <div className="bg-white drop-shadow-lg p-5 m-3 space-y-5 rounded-md absolute">
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
                  <MapSearch
                    label={"Start"}
                    placeholder={"Choose a starting location"}
                    selected={selectedStart}
                    setSelected={setSelectedStart}
                  />
                  {/* @dev make endpoint optional */}
                  <MapSearch
                    label={"End"}
                    placeholder={"Choose an ending location"}
                    selected={selectedEnd}
                    setSelected={setSelectedEnd}
                  />
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Pick some attributes
                  </div>
                  <div className="grid grid-cols-4 w-full gap-2">
                    {attributes?.data.data.map((attribute: string) => {
                      return (
                        <button
                          onClick={(e) => toggleVenueAttribute(e)}
                          className={clsx(
                            "p-2 w-full mb-2 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-sm",
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
                    onClick={() => setAttributesSearchParams([])}
                    className="p-2 mt-2 w-full rounded-lg bg-red-300 transition hover:bg-red-400"
                  >
                    Clear attributes
                  </button>
                </div>
                {venuesPath.length > 0 && (
                  <div className="border bg-gray-200 border-gray-200 rounded-lg"></div>
                )}
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

        {/* map box */}
        <Map
          id="map"
          initialViewState={{
            latitude: centerPoint.lat,
            longitude: centerPoint.long,
            zoom: 14,
            bearing: 0,
            pitch: 0,
          }}
          style={{ height: "94%", position: "absolute", zIndex: -1 }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapboxToken}
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />

          {selectedStart.place_name !== "" && (
            <Marker
              latitude={selectedStart.center[1]}
              longitude={selectedStart.center[0]}
              anchor="bottom"
            >
              {Pin}
            </Marker>
          )}
          {selectedEnd.place_name !== "" && (
            <Marker
              latitude={selectedEnd.center[1]}
              longitude={selectedEnd.center[0]}
              anchor="bottom"
            >
              {Pin}
            </Marker>
          )}

          {venues?.data?.data
            ?.sort(
              (first: Venue, second: Venue) =>
                second.address.latitude - first.address.latitude
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
                    latLong={{
                      lat: venue.address.latitude,
                      long: venue.address.longitude,
                    }}
                  />
                </Marker>
              );
            })}
        </Map>
      </div>
    </MapProvider>
  );
}
const Pin = //@dev use heroicons package
  (
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
