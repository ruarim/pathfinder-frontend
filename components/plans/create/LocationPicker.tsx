import Button from "../../Button";
import MapSearch from "./MapSearch";

interface LocationPickerProps {
  userLocation: LatLong;
  selectedStart: MapLocation;
  setSelectedStart: (location: MapLocation) => void;
  selectedEnd: MapLocation;
  setSelectedEnd: (location: MapLocation) => void;
  setSelectedTabIndex: (index: number) => void;
  hasUserLocation: boolean;
  locationSelected: boolean;
}
export default function LocationPicker({
  userLocation,
  selectedStart,
  selectedEnd,
  setSelectedStart,
  setSelectedEnd,
  setSelectedTabIndex,
  hasUserLocation,
  locationSelected,
}: LocationPickerProps) {
  return (
    <div className="space-y-2">
      <MapSearch
        label={"Start"}
        placeholder={"Choose a starting location"}
        selected={selectedStart}
        setSelected={setSelectedStart}
        userLocation={userLocation}
        hasUserLocation={hasUserLocation}
      />
      <MapSearch
        label={"End"}
        placeholder={"Choose an ending location"}
        selected={selectedEnd}
        setSelected={setSelectedEnd}
        userLocation={userLocation}
        hasUserLocation={hasUserLocation}
      />
      <div className="flex justify-center">
        <Button
          onClick={() => setSelectedTabIndex(1)}
          colour="blue"
          disabled={locationSelected}
        >
          Filter venues
        </Button>
      </div>
    </div>
  );
}
