import { BaseSyntheticEvent, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import VenueCard from "../../components/VenueCard";
import Map, {
  Marker,
  FullscreenControl,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

export default function plans() {
  const [attributesParams, setAttributesParams] = useState<string[]>([]);
  const { data: attributesData } = useGetAttributes();
  const { data: venuesData, isLoading: venuesLoading } =
    useGetVenuesByAttributes(attributesParams);
  const [latLongValues, setLatLongValues] = useState<{
    lat: number;
    long: number;
  }>();

  const addParam = (e: BaseSyntheticEvent) => {
    let value = e.target.innerText;
    let params = attributesParams;

    if (params.includes(value)) {
      const index = params.indexOf(value);
      params.splice(index, 1);
    } else params?.push(value);
    setAttributesParams([...params]);
  };

  //@dev get from users current locaion
  const lat = 51.47513029807826;
  const long = -2.591221556113587;

  return (
    <div className="mx-auto pt-5 p-2 md:px-24 md:space-x-2">
      {attributesData?.data && (
        <div className="grid grid-cols-4 w-full gap-2">
          {attributesData?.data.data.map((attribute: string) => {
            return (
              <button
                onClick={(e) => addParam(e)}
                className={clsx(
                  "p-2 w-full my-2 border-2 border-black transition hover:bg-notice/50 ",
                  attributesParams.includes(attribute) && "bg-notice/50"
                )}
                key={attribute}
              >
                {attribute}
              </button>
            );
          })}
          <button
            onClick={() => setAttributesParams([])}
            className="p-2 w-full my-2 border-2 border-black bg-red-200 transition hover:bg-red-300 md:w-1/2"
          >
            Clear
          </button>
        </div>
      )}
      {/* <div className="pt-6 lg:grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3 w-full">
        {venuesData?.data?.data?.map((venue: Venue) => {
          return <VenueCard key={venue.id} venue={venue} />;
        })}
      </div> */}
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
        style={{ height: 600 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
      >
        {/* @dev these dont look right - probably a css importing issue  */}
        {/* <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl /> */}

        {venuesData?.data?.data?.map((venue: Venue) => {
          return (
            <Marker
              key={venue.id}
              latitude={venue.address.latitude}
              longitude={venue.address.longitude}
              anchor="bottom"
            >
              {Pin}
            </Marker>
          );
        })}
      </Map>
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
