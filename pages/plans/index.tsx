import { BaseSyntheticEvent, useState } from "react";
import {
  useGetAttributes,
  useGetVenuesByAttributes,
} from "../../hooks/queries";
import clsx from "clsx";
import VenueCard from "../../components/VenueCard";

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

  return (
    <div className="mx-auto grid pt-5 p-2 md:px-32 md:space-x-2">
      {attributesData?.data && (
        <div className="grid grid-cols-1 w-1/2">
          {attributesData?.data.data.map((attribute: string) => {
            return (
              <button
                onClick={(e) => addParam(e)}
                className={clsx(
                  "p-2 w-full my-2 border-2 border-black hover:bg-notice/50 md:w-1/2",
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
            className="p-2 my-2 border-2 border-black w-1/2 hover:bg-red-300"
          >
            Clear
          </button>
        </div>
      )}
      <div className="pt-6 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {venuesData?.data?.data?.map((venue: Venue) => {
          return <VenueCard venue={venue} />;
        })}
      </div>
    </div>
  );
}
