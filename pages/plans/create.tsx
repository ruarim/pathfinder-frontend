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
import Modal from "../../components/Modal";
import {
  XMarkIcon,
  MapPinIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useRouter } from "next/router";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import LoadingButton from "../../components/LoadingButton";
import Datepicker from "react-tailwindcss-datepicker";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
const DEFAULT_CENTER_LOCATION = {
  lat: 51.47513029807826,
  long: -2.591221556113587,
};

export default function Create() {
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
  const [isPlanLoading, setPlanLoading] = useState(false);
  const router = useRouter();

  const [isNameModalOpen, setNameModalOpen] = useState(false);

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

  return (
    <MapProvider>
      <div className="mx-auto">
        {/* create plan modal */}
        {attributes?.data && (
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
                    className="p-2 mt-2 w-full rounded-lg bg-red-500 transition hover:bg-red-600 text-white"
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
                  </div>
                )}
              </div>
            )}
            {venuesPlan.length > 0 && (
              <button
                className="p-2 w-full rounded-lg bg-blue-500 transition hover:bg-blue-700 text-white"
                onClick={() => setNameModalOpen(true)}
              >
                Create plan ({venuesPlan.length})
              </button>
            )}
          </div>
        )}

        {isNameModalOpen && (
          <Modal
            isOpen={isNameModalOpen}
            setOpen={setNameModalOpen}
            title="Plan Details"
          >
            <PlanConfigModal
              onSave={(name, start_date, start_time) => {
                if (handleLoggedIn) {
                  handleLoggedIn();
                }
                if (name === "") name = "Untitled Plan";
                setPlanLoading(true);
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
                }).catch(() => setPlanLoading(false));
              }}
              isLoading={isPlanLoading}
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

interface PlanConfigModalProps {
  onSave: (
    name: string,
    start_date: string | undefined,
    start_time: string | undefined
  ) => void;
  isLoading: boolean;
}

function PlanConfigModal({ onSave, isLoading }: PlanConfigModalProps) {
  const [planName, setPlanName] = useState<string>("");
  const [dateValue, setDateValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
  };

  const startDate = dateValue?.startDate?.toString();

  return (
    <div className="flex-wrap space-y-5 pt-2">
      <div className="flex space-x-2">
        <div className="space-y-1">
          <label>Start date</label>
          <Datepicker
            inputClassName={"border border-gray-200"}
            useRange={false}
            asSingle={true}
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>
        <TimePicker />
      </div>
      <div className="space-y-1">
        <label>Plan name</label>
        <input
          className="block w-full appearance-none rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm  text-md"
          placeholder="Enter a name..."
          type="text"
          onChange={(e) => setPlanName(e.currentTarget.value)}
        />
      </div>
      <div className="flex justify-center">
        <LoadingButton
          onClick={() => onSave(planName, startDate, "")}
          isLoading={isLoading}
          styles="bg-indigo-500 hover:bg-indigo-700 max-w-min flex items-center whitespace-nowrap justify-center px-5 py-2 rounded-md shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          Create
        </LoadingButton>
      </div>
    </div>
  );
}

function TimePicker() {
  const hours = Array.from(Array(24).keys());
  const minutes = Array.from(Array(60).keys());

  return (
    <div className="space-y-1">
      <label className="grid grid-cols-1">Start Time</label>
      <div className="inline-flex text-lg border rounded-md p-1.5">
        <select
          name="hours"
          id=""
          className="px-2 outline-none appearance-none bg-transparent"
        >
          {hours.map((hour) => {
            let leadingZero = "";
            if (hour < 10) leadingZero = "0";
            return (
              <option value={hour} key={hour}>
                {`${leadingZero + hour}`}
              </option>
            );
          })}
        </select>
        <span className="px-2">:</span>
        <select
          name="mins"
          id=""
          className="px-2 outline-none appearance-none bg-transparent"
        >
          {minutes.map((min) => {
            let leadingZero = "";
            if (min < 10) leadingZero = "0";
            return (
              <option value={min} key={min}>
                {`${leadingZero + min}`}
              </option>
            );
          })}
        </select>
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
    }
  }, [map]);

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
