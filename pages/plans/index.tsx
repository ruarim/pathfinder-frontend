import { BaseSyntheticEvent, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import VenueMapCard from "../../components/VenueMapCard";
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
    <div className="mx-auto overflow-hidden">
      <div className="absolute">
        {attributesData?.data && (
          <div className="grid grid-cols-4 w-full gap-2 bg-gray-300 p-3 m-3">
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
              className="p-2 w-full my-2 border-2 border-black bg-red-300 transition hover:bg-red-300 "
            >
              Clear
            </button>
          </div>
        )}
      </div>
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
        style={{ height: "94%", position: "absolute", zIndex: -1 }}
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
              <VenueMapCard key={venue.id} venue={venue} />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
