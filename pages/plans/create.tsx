import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  MapProvider,
  useMap,
  Source,
  Layer,
  Map,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapSearch from "../../components/MapSearch";
import VenueMapCard from "../../components/VenueMapCard";
import {
  XMarkIcon,
  MapPinIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useRouter } from "next/router";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import PlanDetailsModal from "../../components/PlanDetailsModal";
import axios from "axios";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
const DEFAULT_CENTER_LOCATION = {
  lat: 51.47513029807826,
  long: -2.591221556113587,
};

export default function Create() {
  const [userLocation, setUserLocation] = useState<LatLong>(
    DEFAULT_CENTER_LOCATION
  );
  const [attributesParams, setAttributesSearchParams] = useState<string[]>([]);
  const [isPlanModalOpen, setPlanModalOpen] = useState(true);
  const [venuesPlan, setVenuesPlan] = useState<Venue[]>([]);
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
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [isCreatePlanLoading, setCreatePlanLoading] = useState(false);
  const router = useRouter();

  const [isPlanDetailsModalOpen, setPlanDetailsModalOpen] = useState(false);

  const { handleLoggedIn } = useAuthContext();

  const toggleVenueAttribute = (e: BaseSyntheticEvent) => {
    let value = e.target.innerText;
    let params = attributesParams;

    if (params.includes(value)) {
      const index = params.indexOf(value);
      params.splice(index, 1);
    } else params?.push(value);
    setAttributesSearchParams([...params]);
  };

  const toggleVenueInPlan = (venue: Venue) => {
    let plan = venuesPlan;

    if (plan.find((e) => e.id === venue.id)) {
      const index = plan.indexOf(venue);
      plan.splice(index, 1);
    } else plan.push(venue);
    setVenuesPlan([...plan]);
  };

  //plans mutation
  const { mutateAsync: savePlan } = useMutation<
    PlanResponse,
    any,
    PlanMutationData
  >({
    mutationFn: (data) => {
      return client.post("paths", data);
    },
  });

  const createPlan = async (planData: PlanMutationData) => {
    const res = await savePlan(planData);
    router.push({ pathname: "/plans/[id]", query: { id: res.data.data.id } });
  };

  const attributesData = attributes?.data.data;

  return (
    <MapProvider>
      <div className="mx-auto ">
        {/* create plan modal */}
        {attributesData && (
          <div className="bg-white drop-shadow-lg p-5 m-3 space-y-5 rounded-md absolute">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Plan your route
              </h2>
              {isPlanModalOpen ? (
                <div
                  onClick={() => setPlanModalOpen(false)}
                  className="hover:animate-pulse"
                >
                  <ChevronDoubleUpIcon className="w-6" />
                </div>
              ) : (
                <div
                  onClick={() => setPlanModalOpen(true)}
                  className="hover:animate-pulse rotate-180"
                >
                  <ChevronDoubleUpIcon className="w-6" />
                </div>
              )}
            </div>
            {isPlanModalOpen && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <MapSearch
                    label={"Start"}
                    placeholder={"Choose a starting location"}
                    selected={selectedStart}
                    setSelected={setSelectedStart}
                    userLocation={userLocation}
                  />
                  <MapSearch
                    label={"End"}
                    placeholder={"Choose an ending location"}
                    selected={selectedEnd}
                    setSelected={setSelectedEnd}
                    userLocation={userLocation}
                  />
                </div>
                <div>
                  {/* choose attributes */}
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Choose some attributes
                  </div>
                  <div className="grid grid-cols-4 w-full gap-2">
                    {attributesData.map((attribute: string, i: number) => {
                      if (i > 7 && !showAllAttributes) return <></>;
                      if (i === 7 && !showAllAttributes)
                        return (
                          <button
                            onClick={(e) => setShowAllAttributes(true)}
                            className={clsx(
                              "p-2 w-full mb-2 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-sm font-bold"
                            )}
                            key={attribute}
                          >
                            show more
                          </button>
                        );
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
                    {showAllAttributes && (
                      <button
                        onClick={(e) => setShowAllAttributes(false)}
                        className={clsx(
                          "p-2 w-full mb-2 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-sm font-bold"
                        )}
                      >
                        show less
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setAttributesSearchParams([])}
                      className="px-5 py-3 w-48 mt-2 rounded-full bg-red-200 transition hover:bg-red-300 text-red-700"
                    >
                      Clear attributes
                    </button>
                  </div>
                </div>
                {venuesPlan.length > 0 && (
                  <div className="border bg-gray-200 border-gray-200 rounded-lg"></div>
                )}
                {venuesPlan.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg">Plan</h3>
                    <div className="space-y-2">
                      {venuesPlan?.map((venue) => {
                        return (
                          <div
                            key={venue.id}
                            className="flex justify-between bg-gray-200 p-2 rounded-md"
                          >
                            {venue.name}
                            <button onClick={() => toggleVenueInPlan(venue)}>
                              <XMarkIcon className="w-6" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {venuesPlan.length > 0 && (
              <div className="flex justify-center">
                <button
                  className="px-6 py-3 w-48 rounded-full bg-blue-200 transition hover:bg-blue-300 text-blue-700"
                  onClick={() => setPlanDetailsModalOpen(true)}
                >
                  Create plan ({venuesPlan.length})
                </button>
              </div>
            )}
          </div>
        )}

        {isPlanDetailsModalOpen && (
          <PlanDetailsModal
            isOpen={isPlanDetailsModalOpen}
            setOpen={setPlanDetailsModalOpen}
            onSave={(name, start_date, start_time) => {
              if (handleLoggedIn) {
                handleLoggedIn();
              }
              if (name === "") name = "Untitled Plan";
              setCreatePlanLoading(true);
              createPlan({
                name,
                start_time,
                start_date,
                venues: venuesPlan.map((venue) => venue.id),
                startpoint_name: selectedStart.place_name,
                startpoint_lat: selectedStart.center[1],
                startpoint_long: selectedStart.center[0],
                endpoint_name: selectedEnd.place_name,
                endpoint_lat: selectedEnd.center[1],
                endpoint_long: selectedEnd.center[0],
              }).catch(() => setCreatePlanLoading(false));
            }}
            isLoading={isCreatePlanLoading}
          />
        )}

        {/* map box */}
        <MapBox
          setUserLocation={setUserLocation}
          venues={venues}
          venuesPlan={venuesPlan}
          startPoint={selectedStart}
          endPoint={selectedEnd}
          toggleVenueInPlan={toggleVenueInPlan}
        />
      </div>
    </MapProvider>
  );
}

interface MapBoxProps {
  setUserLocation: (location: LatLong) => void;
  venues: VenuesResponse;
  venuesPlan: Venue[];
  startPoint: MapLocation;
  endPoint: MapLocation;
  toggleVenueInPlan: (venue: Venue) => void;
}

function MapBox({
  setUserLocation,
  venues,
  venuesPlan,
  startPoint,
  endPoint,
  toggleVenueInPlan,
}: MapBoxProps) {
  const { map } = useMap();

  //center map on user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.longitude,
          long: position.coords.latitude,
        });
        if (map)
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
          });
      });
    }
  }, [map]);

  const getPlanPoints = (
    venues: Venue[],
    start?: { lat?: number; long?: number },
    end?: { lat?: number; long?: number }
  ) => {
    const venuePoints = venues.map(
      (venue) => `${venue.address.longitude},${venue.address.latitude}`
    );

    let points = "";
    if (startPoint.place_name != "") points += `${start?.lat},${start?.long};`;
    if (venuePoints.length > 0) points += `${venuePoints.join(";")}`;
    if (endPoint.place_name != "") points += `;${end?.lat},${end?.long}`;

    return points;
  };

  const routePoints = getPlanPoints(
    venuesPlan,
    { lat: startPoint.center[0], long: startPoint.center[1] },
    { lat: endPoint.center[0], long: endPoint.center[1] }
  );

  useEffect(() => {
    const step = "20";
    const radiuses = venuesPlan.map(() => step);
    if (startPoint.place_name != "") radiuses.push(step);
    if (endPoint.place_name != "") radiuses.push(step);
    const radiusesString = radiuses.join(";");

    axios
      .get(
        `https://api.mapbox.com/matching/v5/mapbox/driving/${routePoints}?geometries=geojson&radiuses=${radiusesString}&access_token=${mapboxToken}`
      )
      .then((res) => setRouteCoords(res.data.matchings[0].geometry.coordinates))
      .catch((e) => console.log(e));
  }, [venuesPlan, startPoint, endPoint]);

  const [openVenueCard, setOpenVenueCard] = useState<number>(0);
  const [routeCoords, setRouteCoords] = useState<number[][]>();

  let venuesRoute;
  if (routeCoords)
    venuesRoute = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [...routeCoords],
      },
    };

  //@dev create render geoPoints list and sort to fix venueMapCard overlap
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

      {/* start and endpoint */}
      <div className="text-black">
        {startPoint.place_name !== "" && (
          <Marker
            latitude={startPoint.center[1]}
            longitude={startPoint.center[0]}
            anchor="bottom"
          >
            <MapPinIcon className="w-8" />
          </Marker>
        )}
        {endPoint.place_name !== "" && (
          <Marker
            latitude={endPoint.center[1]}
            longitude={endPoint.center[0]}
            anchor="bottom"
          >
            <MapPinIcon className="w-8" />
          </Marker>
        )}
      </div>

      {/* venues that match attributes */}
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
                venuesPlan={venuesPlan}
                toggleVenueInPlan={toggleVenueInPlan}
                latLong={{
                  lat: venue.address.latitude,
                  long: venue.address.longitude,
                }}
                openVenueCard={openVenueCard}
                setOpenVenueCard={setOpenVenueCard}
              />
            </Marker>
          );
        })}

      {/* venues in plan */}
      {venuesPlan
        .sort(
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
                venuesPlan={venuesPlan}
                toggleVenueInPlan={toggleVenueInPlan}
                latLong={{
                  lat: venue.address.latitude,
                  long: venue.address.longitude,
                }}
                openVenueCard={openVenueCard}
                setOpenVenueCard={setOpenVenueCard}
              />
            </Marker>
          );
        })}

      {routeCoords && venuesPlan.length > 0 && (
        /* @ts-ignore */
        <Source id="polylineLayer" type="geojson" data={venuesRoute}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "rgba(3, 170, 238, 0.5)",
              "line-width": 5,
            }}
          />
        </Source>
      )}
    </Map>
  );
}
