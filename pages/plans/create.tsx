import { useEffect, useState } from "react";
import { useGetAttributes } from "../../hooks/queries";
import clsx from "clsx";
import {
  Marker,
  NavigationControl,
  GeolocateControl,
  MapProvider,
  useMap,
  Source,
  Layer,
  Map,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  XMarkIcon,
  MapPinIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useRouter } from "next/router";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import PlanDetailsModal from "../../components/plans/create/PlanDetailsModal";
import { useMapRoute } from "../../hooks/queries/useMapRoute";
import { Tab } from "@headlessui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import AttributesPicker from "../../components/plans/create/AttributePicker";
import LocationPicker from "../../components/plans/create/LocationPicker";
import SuggestionResults from "../../components/plans/create/SuggestionResults";
import Button from "../../components/Button";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;
const DEFAULT_CENTER_LOCATION = {
  lat: 51.47513029807826,
  long: -2.591221556113587,
};

export const pinColours = [
  ["text-red-600", "bg-red-100"],
  ["text-blue-600", "bg-blue-100"],
  ["text-fuchsia-600", "bg-fuchsia-100"],
  ["text-lime-600", "bg-lime-100"],
  ["text-purple-600", "bg-purple-100"],
  ["text-indigo-600", "bg-indigo-100"],
  ["text-violet-600", "bg-violet-100"],
];

export default function Create() {
  const { handleLoggedIn } = useAuthContext();
  const router = useRouter();

  const [isPlanDetailsModalOpen, setPlanDetailsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLong>(
    DEFAULT_CENTER_LOCATION
  );
  const [selectedStart, setSelectedStart] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });
  const [selectedEnd, setSelectedEnd] = useState<MapLocation>({
    place_name: "",
    center: [0, 0],
  });
  const [selectedAttributes, setSelectedAttributes] = useState<string[][]>([
    [],
  ]);
  const [suggestedVenueIndex, setSuggestedVenueIndex] = useState(0);
  const [isCreatePlanLoading, setCreatePlanLoading] = useState(false);

  const { data: venueSuggestion, isLoading: suggestionsLoading } = useQuery(
    ["suggestion", selectedAttributes, selectedStart, selectedEnd],
    (): Promise<VenuesResponse> =>
      client.get("venues/suggest/shortest", {
        params: {
          start_coords: [selectedStart.center[1], selectedStart.center[0]],
          end_coords: [selectedEnd.center[1], selectedEnd.center[0]],
          attributes: selectedAttributes,
        },
        paramsSerializer: {
          indexes: false,
        },
      }),
    { enabled: selectedAttributes[0].length > 0 }
  );
  const suggestions = venueSuggestion?.data.data;

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

  const handleSavePlan = (
    name: string,
    start_date: string | undefined,
    start_time: string | undefined
  ) => {
    if (!suggestions) return;
    if (handleLoggedIn) {
      handleLoggedIn();
    }
    if (name === "") name = "Untitled Plan";
    setCreatePlanLoading(true);
    createPlan({
      name,
      start_time,
      start_date,
      venues: suggestions.map((venue) => venue.id),
      startpoint_name: selectedStart.place_name,
      startpoint_lat: selectedStart.center[1],
      startpoint_long: selectedStart.center[0],
      endpoint_name: selectedEnd.place_name,
      endpoint_lat: selectedEnd.center[1],
      endpoint_long: selectedEnd.center[0],
    }).catch(() => setCreatePlanLoading(false));
  };

  return (
    <MapProvider>
      <div className="mx-auto">
        <FilterVenues
          userLocation={userLocation}
          setSelectedStart={setSelectedStart}
          setSelectedEnd={setSelectedEnd}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          setSelectedAttributes={setSelectedAttributes}
          selectedAttributes={selectedAttributes}
          setPlanDetailsModalOpen={setPlanDetailsModalOpen}
          suggestionsLoading={suggestionsLoading}
          suggestions={suggestions}
          suggestedVenueIndex={suggestedVenueIndex}
          setSuggestedVenueIndex={setSuggestedVenueIndex}
        />

        {isPlanDetailsModalOpen && suggestions && (
          <PlanDetailsModal
            isOpen={isPlanDetailsModalOpen}
            setOpen={setPlanDetailsModalOpen}
            onSave={(name, start_date, start_time) => {
              handleSavePlan(name, start_date, start_time);
            }}
            isLoading={isCreatePlanLoading}
          />
        )}

        <MapBox
          setUserLocation={setUserLocation}
          startPoint={selectedStart}
          endPoint={selectedEnd}
          suggestedVenues={suggestions}
          setSuggestedVenueIndex={setSuggestedVenueIndex}
        />
      </div>
    </MapProvider>
  );
}

interface FilterVenuesProps {
  userLocation: LatLong;
  setSelectedStart: (location: MapLocation) => void;
  setSelectedEnd: (location: MapLocation) => void;
  selectedStart: MapLocation;
  selectedEnd: MapLocation;
  setSelectedAttributes: (stops: string[][]) => void;
  selectedAttributes: string[][];
  setPlanDetailsModalOpen: (value: boolean) => void;
  suggestionsLoading: boolean;
  suggestions: Venue[] | undefined;
  suggestedVenueIndex: number;
  setSuggestedVenueIndex: (index: number) => void;
}

function FilterVenues({
  userLocation,
  setSelectedStart,
  setSelectedEnd,
  selectedStart,
  selectedEnd,
  setSelectedAttributes,
  selectedAttributes,
  setPlanDetailsModalOpen,
  suggestionsLoading,
  suggestions,
  suggestedVenueIndex,
  setSuggestedVenueIndex,
}: FilterVenuesProps) {
  const hasUserLocation = () =>
    userLocation.lat == DEFAULT_CENTER_LOCATION.lat &&
    userLocation.long == DEFAULT_CENTER_LOCATION.long
      ? true
      : false;

  const [isPlanModalOpen, setPlanModalOpen] = useState(true);
  const { data: attributesData } = useGetAttributes();
  const attributes = attributesData?.data.data;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedAttributesIndex, setSelectedAttributesIndex] = useState(1);

  const attributesSelected = () => selectedAttributes[0].length == 0;
  const locationSelected = () =>
    selectedStart.place_name == "" || selectedEnd.place_name == "";

  return (
    <div className="bg-white drop-shadow-lg px-5 py-4 m-3 space-y-5 rounded-md absolute w-5/6 min-[590px]:w-[350px]">
      <div className="flex justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Plan your route</h2>
        {isPlanModalOpen ? (
          <button
            onClick={() => setPlanModalOpen(false)}
            className="hover:animate-pulse"
          >
            <XMarkIcon className="w-6 hover:text-gray-700" />
          </button>
        ) : (
          <button
            onClick={() => setPlanModalOpen(true)}
            className="hover:animate-pulse rotate-180"
          >
            <ChevronDoubleUpIcon className="w-6" />
          </button>
        )}
      </div>
      {isPlanModalOpen && (
        <div className="w-full max-w-md ">
          <Tab.Group
            selectedIndex={selectedTabIndex}
            onChange={setSelectedTabIndex}
          >
            <div className="grid grid-cols-5 place-items-center">
              <label className="w-full col-start-1 flex justify-center font-semibold">
                Location
              </label>
              <label className="w-full col-start-3 flex justify-center font-semibold">
                Filter
              </label>
              <label className="w-full col-start-5 flex justify-center font-semibold">
                Results
              </label>
            </div>
            <Tab.List className="flex h-full items-center space-x-1 rounded-xl p-1">
              <div className="w-full">
                <div className="flex justify-center">
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        "w-5 h-5 rounded-full py-2.5 text-sm font-medium bg-gray-200 text-gray-800",
                        selected ? "bg-gray-400 shadow" : "hover:bg-gray-400 "
                      )
                    }
                  />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 border-2 border-gray-200 -z-10 rounded-full mx-auto"></div>
              <div className="w-full">
                <div className="flex justify-center">
                  <Tab
                    disabled={locationSelected()}
                    className={({ selected }) =>
                      clsx(
                        "w-5 h-5 rounded-full py-2.5 text-sm font-medium bg-gray-200 text-gray-800",
                        selected ? "bg-gray-400 shadow" : "hover:bg-gray-400 "
                      )
                    }
                  />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 border-2 border-gray-200 -z-10 rounded-full mx-auto"></div>
              <div className="w-full">
                <div className="flex justify-center">
                  <Tab
                    disabled={attributesSelected()}
                    className={({ selected }) =>
                      clsx(
                        "w-5 h-5 rounded-full py-2.5 text-sm font-medium bg-gray-200 text-gray-800",
                        selected ? "bg-gray-400 shadow" : "hover:bg-gray-400 "
                      )
                    }
                  />
                </div>
              </div>
            </Tab.List>
            <Tab.Panels className={"pt-2"}>
              <Tab.Panel>
                {/* choose start stops point */}
                <LocationPicker
                  selectedStart={selectedStart}
                  setSelectedStart={setSelectedStart}
                  userLocation={userLocation}
                  selectedEnd={selectedEnd}
                  setSelectedEnd={setSelectedEnd}
                  setSelectedTabIndex={setSelectedTabIndex}
                  hasUserLocation={hasUserLocation()}
                  locationSelected={locationSelected()}
                />
              </Tab.Panel>
              <Tab.Panel>
                <AttributesPicker
                  attributes={attributes}
                  selectedAttributes={selectedAttributes}
                  setSelectedAttributes={setSelectedAttributes}
                  attributesIndex={selectedAttributesIndex}
                  setAttributesIndex={setSelectedAttributesIndex}
                  setSelectedTabIndex={setSelectedTabIndex}
                  suggestions={suggestions}
                />
              </Tab.Panel>
              <Tab.Panel>
                {suggestionsLoading && <LoadingSpinner />}
                {suggestions && !suggestionsLoading && (
                  <div className="space-y-1">
                    <SuggestionResults
                      suggestions={suggestions}
                      currentIndex={suggestedVenueIndex}
                      setCurrentIndex={setSuggestedVenueIndex}
                    />
                    <div className="flex justify-center">
                      <Button
                        colour="blue"
                        onClick={() => setPlanDetailsModalOpen(true)}
                      >
                        Save route
                      </Button>
                    </div>
                  </div>
                )}
                {suggestions === undefined && !suggestionsLoading && (
                  <div className="font-medium text-gray-700">
                    No Suggestion Found
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  );
}

interface MapBoxProps {
  setUserLocation: (location: LatLong) => void;
  startPoint: MapLocation;
  endPoint: MapLocation;
  suggestedVenues: Venue[] | undefined;
  setSuggestedVenueIndex: (index: number) => void;
}

function MapBox({
  setUserLocation,
  startPoint,
  endPoint,
  suggestedVenues,
  setSuggestedVenueIndex,
}: MapBoxProps) {
  const { map } = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });

        if (map)
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
          });
      });
    }
  }, [map]);

  const { data: routeData } = useMapRoute({
    venues: suggestedVenues,
    startPoint,
    endPoint,
  });
  const suggestedCoords = routeData?.data?.routes[0]?.geometry.coordinates;

  let suggestedRoute;
  if (suggestedCoords)
    suggestedRoute = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [...suggestedCoords],
      },
    };

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

      {suggestedVenues &&
        suggestedVenues.map((venue: Venue, i: number) => (
          <Marker
            onClick={() => setSuggestedVenueIndex(i)}
            key={venue.id}
            latitude={venue.address.latitude}
            longitude={venue.address.longitude}
            anchor="bottom"
          >
            <MapPinIcon className={`w-8 ${pinColours[i][0]}`} />
          </Marker>
        ))}
      {suggestedCoords && suggestedVenues && (
        /* @ts-ignore */
        <Source id="polylineLayer" type="geojson" data={suggestedRoute}>
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
