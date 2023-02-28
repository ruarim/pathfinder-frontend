import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
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
import Modal from "../../components/Modal";
import {
  XMarkIcon,
  MapPinIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useRouter } from "next/router";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
const DEFAULT_CENTER_LOCATION = {
  lat: 51.47513029807826,
  long: -2.591221556113587,
};

export default function Create() {
  const [attributesParams, setAttributesSearchParams] = useState<string[]>([]);
  const [isPlanModalOpen, setPlanModalOpen] = useState(true);
  const [venuesPlan, setVenuesPlan] = useState<Venue[]>([]); //@dev might need venue id for db ref
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

  const router = useRouter();

  const [isNameModalOpen, setNameModalOpen] = useState(false);

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
    if (plan.includes(venue)) {
      const index = plan.indexOf(venue);
      plan.splice(index, 1);
    } else plan.push(venue);
    setVenuesPlan([...plan]);
  };

  //plans mutation
  const { mutateAsync: savePlan } = useMutation<PlanResponse, any, Plan>({
    mutationFn: (data) => {
      return client.post("paths", data);
    },
  });

  const createPlan = async (
    name: string,
    venuesInPlan: Venue[],
    start: MapLocation,
    end: MapLocation
  ) => {
    const venues = venuesInPlan.map((venue) => venue.id);

    const res = await savePlan({
      name,
      startpoint_name: start.place_name,
      startpoint_lat: start.center[1],
      startpoint_long: start.center[0],
      endpoint_name: end.place_name,
      endpoint_lat: end.center[1],
      endpoint_long: end.center[0],
      venues,
    });

    router.push({ pathname: "/plans/[id]", query: { id: res.data.data.id } });
  };

  return (
    <MapProvider>
      <div className="mx-auto">
        {/* create plan modal */}
        {attributes?.data && (
          <div className="bg-white drop-shadow-lg p-5 m-3 space-y-5 rounded-md absolute">
            <div className="flex justify-between gap-3">
              <h2 className="text-xl font-medium text-gray-900">
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
                  />
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
                    <button
                      className="p-2 w-full rounded-lg bg-blue-300 transition hover:bg-blue-400"
                      onClick={() => setNameModalOpen(true)}
                    >
                      Create plan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {isNameModalOpen && (
          <Modal
            isOpen={isNameModalOpen}
            setOpen={setNameModalOpen}
            title="Give the plan a name"
          >
            <NameModal
              onSave={(name: string) => {
                if (name === "") name = "Untitled Plan";
                createPlan(name, venuesPlan, selectedStart, selectedEnd);
              }}
            />
          </Modal>
        )}

        {/* map box */}
        <MapBox
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

interface NameModalProps {
  onSave: (name: string) => void;
}

function NameModal({ onSave }: NameModalProps) {
  const [planName, setPlanName] = useState<string>("");
  return (
    <div className="flex-wrap space-y-3 pt-2">
      <input
        className="w-full text-xl p-1"
        type="text"
        onChange={(e) => setPlanName(e.currentTarget.value)}
      />
      <div className="flex justify-center">
        <button
          className="bg-blue-400 w-full rounded-md p-2"
          onClick={() => onSave(planName)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface MapBoxProps {
  venues: VenueResponse;
  venuesPlan: Venue[];
  startPoint: MapLocation;
  endPoint: MapLocation;
  toggleVenueInPlan: (venue: Venue) => void;
}

function MapBox({
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
        if (map)
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
          });
      });
    } else {
      /* geolocation IS NOT available, handle it */
      //@dev TODO show modal
      console.log("geolocation not available");
    }
  }, [map]);

  //@dev create render geoPoints list and sort to fix venue map card overlap
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
              />
            </Marker>
          );
        })}
    </Map>
  );
}
