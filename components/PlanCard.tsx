import { StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import AvatarIcon from "./AvatarIcon";

const getCreator = (users: User[]) => {
  return users.find((user) => user.is_creator === 1);
};

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

  const avg_rating = plan?.rating == undefined ? 0 : plan?.rating;
  const numberOfVenues = plan.venues.length < 7 ? plan.venues.length : 6;
  const creator = getCreator(plan.users);

  return (
    <div
      key={plan.name}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      {numberOfVenues == 1 ? (
        <div className="flex">
          {plan.venues.map((venue) => (
            <img
              className={`h-48 w-full object-cover`}
              src={venue.images[0] ?? "/pub-placeholder.jpg"}
              alt=""
            />
          ))}
        </div>
      ) : (
        <div className="flex">
          {plan.venues.map((venue, i) => {
            if (i >= 6) return <></>;
            return (
              <img
                className={`h-48 w-1/${numberOfVenues} object-cover`}
                src={venue.images[0] ?? "/pub-placeholder.jpg"}
                alt=""
              />
            );
          })}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <p className="flex justify-between text-xl font-medium text-primary">
            <Link href={`${plan.id}`} className="hover:underline truncate ...">
              {plan.name}
            </Link>
            <div className="flex">
              <div className="pt-1 pl-2 flex">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={clsx(
                      avg_rating > rating ? "text-yellow-400" : "text-gray-300",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-lg">({avg_rating})</div>
            </div>
          </p>
          <div className="space-y-1 mt-1">
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

          <div className="flex justify-between">
            <div className="pt-5">
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
            <Link
              href={`venues/${plan.id}`}
              className="mt-2 flex space-x-2 pt-1"
            >
              <>
                {creator && (
                  <h2 className="text-lg font-medium flex gap-2 ">
                    <p className="pt-2"> {creator?.username}</p>
                    {<AvatarIcon imageUrl={creator?.avatar_url} />}
                  </h2>
                )}
              </>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
