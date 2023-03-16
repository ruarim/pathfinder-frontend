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
import DropDown from "../../components/Dropdown";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

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

  return (
    <MapProvider>
      <div className="mx-auto ">
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
                    {attributes?.data.data.map(
                      (attribute: string, i: number) => {
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
                      }
                    )}
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
          <Modal
            isOpen={isPlanDetailsModalOpen}
            setOpen={setPlanDetailsModalOpen}
            title="Plan Details"
          >
            <PlanDetailsModal
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

interface PlanDetailsModalProps {
  onSave: (
    name: string,
    start_date: string | undefined,
    start_time: string | undefined
  ) => void;
  isLoading: boolean;
}
type TimeType = {
  hour: string;
  minute: string;
};

function PlanDetailsModal({ onSave, isLoading }: PlanDetailsModalProps) {
  const [planName, setPlanName] = useState<string>("");
  const [dateValue, setDateValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [timeValue, setTimeValue] = useState<TimeType>({
    hour: "",
    minute: "",
  });

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
  };
  const handleTimeChange = (newValue: TimeType) => {
    setTimeValue(newValue);
  };

  const startDate = dateValue?.startDate?.toString();
  const startTime =
    timeValue.hour != "" && timeValue.minute != ""
      ? `${timeValue.hour}:${timeValue.minute}`
      : undefined;

  return (
    <div className="flex-wrap space-y-5 pt-2">
      <div className="flex space-x-2">
        <div className="space-y-1">
          <label>Start date</label>
          <Datepicker
            inputClassName={"border border-gray-300 h-9"}
            useRange={false}
            asSingle={true}
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>
        <TimePicker onChange={handleTimeChange} />
      </div>
      <div className="space-y-1">
        <label>Plan name</label>
        <input
          className="block h-12 w-full appearance-none rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm  text-md"
          placeholder="Enter a name..."
          type="text"
          onChange={(e) => setPlanName(e.currentTarget.value)}
        />
      </div>
      <div className="flex justify-center">
        <LoadingButton
          onClick={() => onSave(planName, startDate, startTime)}
          isLoading={isLoading}
          styles="bg-indigo-500 hover:bg-indigo-700 max-w-min flex items-center whitespace-nowrap justify-center px-5 py-2 rounded-md shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          Create
        </LoadingButton>
      </div>
    </div>
  );
}

function TimePicker({ onChange }: { onChange: (newValue: TimeType) => void }) {
  const hours = [
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const minutes = ["00", "15", "30", "45"];
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  useEffect(() => {
    onChange({ hour, minute });
  }, [hour, minute]);

  return (
    <div className="space-y-1">
      <label className="grid grid-cols-1">Start Time</label>
      <div className="inline-flex text-lg rounded-md">
        <DropDown options={hours} value={hour} setValue={setHour} />
        <span className="px-2">:</span>
        <DropDown options={minutes} value={minute} setValue={setMinute} />
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
