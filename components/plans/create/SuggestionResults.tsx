import { useEffect } from "react";
import { useMap } from "react-map-gl";
import CardSlider from "../../CardSlider";
import VenueMapCard from "./VenueMapCard";

interface SuggestionResultsProps {
  suggestions: Venue[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}
export default function SuggestionResults({
  suggestions,
  currentIndex,
  setCurrentIndex,
}: SuggestionResultsProps) {
  const { map } = useMap();

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [
          suggestions[currentIndex].address.longitude,
          suggestions[currentIndex].address.latitude,
        ],
        zoom: 14,
      });
    }
  }, [currentIndex]);

  return (
    <div>
      <h2 className="text-md font-medium text-gray-700 mb-2">Route</h2>
      <CardSlider currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}>
        {suggestions.map((venue, i) => (
          <VenueMapCard venue={venue} index={i} key={i} />
        ))}
      </CardSlider>
    </div>
  );
}
