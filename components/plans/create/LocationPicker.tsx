import Button from "../../Button";
import MapSearch from "./MapSearch";

interface LocationPickerProps {
  selectedStart: MapLocation;
  setSelectedStart: (location: MapLocation) => void;
  userLocation: LatLong;
  selectedEnd: MapLocation;
  setSelectedEnd: (location: MapLocation) => void;
  setSelectedPlanningIndex: (index: number) => void;
  hasUserLocation: boolean;
}
export default function LocationPicker({
  selectedStart,
  setSelectedStart,
  userLocation,
  selectedEnd,
  setSelectedEnd,
  setSelectedPlanningIndex,
  hasUserLocation,
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
        <Button onClick={() => setSelectedPlanningIndex(1)} colour="blue">
          Filter venues
        </Button>
      </div>
    </div>
  );
}
