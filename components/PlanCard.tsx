import { MapPinIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  let attributes = [] as string[];
  plan.venues.map((venue) => {
    venue.attributes.map((attribute) =>
      attributes.includes(attribute) ? null : attributes.push(attribute)
    );
  });

  const avg_rating = plan?.rating;

  return (
    <div className="bg-gradient-to-r from-green-300 to-blue-500 rounded-md p-1.5 shadow-md">
      <Link href={`${plan.id}`} className=" space-y-2 rounded-md">
        <div className="p-2 bg-white rounded-md h-full space-y-2">
          <div className="flex justify-between">
            <div className="flex  pt-1">
              <MapPinIcon className="w-12 text-red-400" />
              <div>
                <div className="text-xl font-medium text-primary text-clip overflow-hidden ...">
                  {plan.name}
                </div>
                <div className="flex space-x-2">
                  <div>{plan.start_date}</div>
                  <div>{plan.start_time}</div>
                </div>
                {plan.venues.length === 1 ? (
                  <div className="font-medium">{plan.venues.length} Venue</div>
                ) : (
                  <div className="font-medium">{plan.venues.length} Venues</div>
                )}
                <div className="pt-1 flex">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={clsx(
                        avg_rating > rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>
            {plan.is_public === 1 ? (
              <div className="text-gray-400 flex pt-1">
                <div>Private</div>
                <div className="pl-1 pt-1">
                  <LockOpenIcon className="w-4" />
                </div>
              </div>
            ) : (
              <div className="text-gray-400 flex pt-1">
                <div>Private</div>
                <div className="pl-1 pt-1">
                  <LockClosedIcon className="w-4" />
                </div>
              </div>
            )}
          </div>
          <div className="pt-1">
            <div className="p-0.5">
              {attributes.map((attribute, i) => {
                if (i === 4)
                  return (
                    <div
                      key={attribute}
                      className="bg-teal-400 text-white p-2 rounded-md space-x-1 text-xs font-medium inline-flex mr-1"
                    >
                      <div>...</div>
                    </div>
                  );
                if (i > 4) return <></>;
                return (
                  <div
                    key={attribute}
                    className="bg-teal-400 text-white p-2 rounded-md space-x-1 text-xs font-medium inline-flex mr-1"
                  >
                    <div>{attribute}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
