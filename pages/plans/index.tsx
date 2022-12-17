import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  MapProvider,
  useMap,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapSearch from "../../components/MapSearch";
import VenueMapCard from "../../components/VenueMapCard";
import {
  XMarkIcon,
  MapPinIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/outline";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
const DEFAULT_CENTER_LOCATION = {
  lat: 51.47513029807826,
  long: -2.591221556113587,
};

export default function Plans() {
  const [attributesParams, setAttributesSearchParams] = useState<string[]>([]);
  const [isPathModalOpen, setPathModalOpen] = useState(true);
  const [venuesPath, setVenuesPath] = useState<string[]>([]); //@dev might need venue id for db ref
  const [selectedStart, setSelectedStart] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });
  const [selectedEnd, setSelectedEnd] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });

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
                  <ChevronDoubleUpIcon className="w-6" />
                </div>
              ) : (
                <div
                  onClick={() => setPathModalOpen(true)}
                  className="hover:animate-pulse rotate-180"
                >
                  <ChevronDoubleUpIcon className="w-6" />
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
                  {/* @TODO make endpoint optional */}
                  <MapSearch
                    label={"End"}
                    placeholder={"Choose an ending location"}
                    selected={selectedEnd}
                    setSelected={setSelectedEnd}
                  />
                </div>
                <div>
                  {/* choose attributes */}
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Choose some attributes
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
                              <XMarkIcon className="w-6" />
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
        <MapBox
          venues={venues}
          venuesPath={venuesPath}
          startPoint={selectedStart}
          endPoint={selectedEnd}
          toggleVenueInPath={toggleVenueInPath}
        />
      </div>
    </MapProvider>
  );
}

interface MapBoxProps {
  venues: VenueResponse;
  venuesPath: string[];
  startPoint: MapLocation;
  endPoint: MapLocation;
  toggleVenueInPath: (venue: string) => void;
}

export function MapBox({
  venues,
  venuesPath,
  startPoint,
  endPoint,
  toggleVenueInPath,
}: MapBoxProps) {
  const { map } = useMap();

  //center map on user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (map)
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
          });
      });
    } else {
      /* geolocation IS NOT available, handle it */
      //@TODO show modal
      console.log("geolocation not available");
    }
  }, [map]);

  return (
    <Map
      id="map"
      initialViewState={{
        latitude: DEFAULT_CENTER_LOCATION.lat,
        longitude: DEFAULT_CENTER_LOCATION.long,
        zoom: 14,
        bearing: 0,
        pitch: 0,
      }}
      style={{ height: "100%", position: "absolute", zIndex: -1 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxToken}
    >
      <GeolocateControl position="top-right" />
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />

      {startPoint.place_name !== "" && (
        <Marker
          latitude={startPoint.center[1]}
          longitude={startPoint.center[0]}
          anchor="bottom"
        >
          <MapPinIcon />
        </Marker>
      )}
      {endPoint.place_name !== "" && (
        <Marker
          latitude={endPoint.center[1]}
          longitude={endPoint.center[0]}
          anchor="bottom"
        >
          <MapPinIcon />
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
  );
}
