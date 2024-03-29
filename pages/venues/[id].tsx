import React, { useState } from "react";
import { Fragment } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import Modal from "../../components/Modal";
import LoadingButton from "../../components/LoadingButton";
import { useForm } from "react-hook-form";
import AvatarIcon from "../../components/AvatarIcon";
import Button from "../../components/Button";

export default function Venue({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { isLoggedIn, handleLoggedIn } = useAuthContext();
  const [isFavouriteLoading, setFavouriteLoading] = useState(false);

  const { data: venueData } = useQuery<VenuesResponse, any, any>(
    ["venue", id],
    () => client.get(`venues/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(["rating", id]),
    }
  );

  const { mutateAsync: favourite } = useMutation<any, any, { remove: boolean }>(
    (data) => {
      return client.post(`venues/${id}/favourite`, data);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["favourite"]),
    }
  );

  const { data: favouritedData } = useQuery<{ data: { favourited: boolean } }>(
    ["favourite"],
    (data) => {
      return client.get(`venues/${id}/favourited`, data);
    }
  );

  const favourited = favouritedData?.data?.favourited || false;

  const handleFavourite = async (remove: boolean) => {
    setFavouriteLoading(true);
    try {
      if (handleLoggedIn) handleLoggedIn();
      await favourite({ remove });
      queryClient.invalidateQueries(["venue_favourites"]);
    } catch (e) {
      console.log(e);
    }
    setFavouriteLoading(false);
  };

  const venue: Venue = venueData?.data?.data;
  const venueAddress: Address = venue?.address;
  const venueRating: number = venue && venue.rating;
  const venueId = id;

  return (
    <div>
      {venue && (
        <div className="mx-auto pt-6 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            <div className="lg:col-span-4 lg:row-end-1">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={venue.images[0]}
                  className="object-fill w-full object-center"
                />
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
              <div className="flex flex-col-reverse">
                <div className="mt-4">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {venue?.name}
                  </h1>
                  <h2 id="information-heading" className="sr-only">
                    Pub information
                  </h2>
                </div>
              </div>

              <div className="space-y-1 mt-1">
                {venue?.attributes?.map((attribute) => {
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

              <p className="mt-6 text-gray-500">
                {venue?.description ?? "A nice pub for now."}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {!favourited || !isLoggedIn ? (
                  <LoadingButton
                    isLoading={isFavouriteLoading}
                    onClick={() => handleFavourite(false)}
                    type="button"
                    styles={
                      '"flex w-full items-center justify-center rounded-md border border-transparent bg-purple-500 py-3 px-8 text-base font-medium text-white hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 focus:ring-offset-gray-50"'
                    }
                  >
                    Add to favourites
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    isLoading={isFavouriteLoading}
                    onClick={() => handleFavourite(true)}
                    type="button"
                    styles="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-100 hover:bg-purple-200 py-3 px-8 text-base font-medium text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Remove favourite
                  </LoadingButton>
                )}
                <Review id={id} />
              </div>
              <div className="mt-10 border-t border-gray-200 py-4">
                <div className="border-b border-gray-200 pt-2">
                  <Rating {...{ venueRating, venueId }} />
                </div>
                <h2 className="mt-3 text-primary text-lg">Address</h2>
                <p className="text-primary text-sm">{venueAddress.address_1}</p>
                <p className="text-primary text-sm">
                  {venueAddress?.address_2}
                </p>
                <p className="text-primary text-sm">{venueAddress.town_city}</p>
                <p className="text-primary text-sm">{venueAddress.postcode}</p>
                <p className="text-primary text-sm">{venueAddress.country}</p>
              </div>

              <div className="mt-1 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">Share</h3>
                <ul role="list" className="mt-4 flex items-center space-x-6">
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Facebook</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Instagram</span>
                      <svg
                        className="h-6 w-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Twitter</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <Reviews id={id} />
          </div>
        </div>
      )}
    </div>
  );
}

function Review({ id }: { id: string }) {
  const { isLoggedIn, handleLoggedIn } = useAuthContext();
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    resetField,
  } = useForm<{ content: string }>();

  const { mutateAsync: addReview } = useMutation<any, any, { content: string }>(
    (data) => {
      return client.post(`venues/${id}/review`, data);
    }
  );

  const handleReviewClick = async () => {
    if (handleLoggedIn) handleLoggedIn();
    if (isLoggedIn) setReviewModalOpen(true);
  };

  const handleAddReview = async (data: { content: string }) => {
    if (!data.content)
      return setError("content", {
        message: "Add some content to your review.",
      });
    setLoading(true);
    await addReview(data)
      .then(() => {
        setReviewModalOpen(false);
        queryClient.invalidateQueries(["reviews", id]);
        resetField("content");
      })
      .catch(() => {
        setError("content", {
          message: "Review failed.",
        });
        setLoading(false);
      });
  };

  return (
    <>
      <button
        onClick={() => handleReviewClick()}
        type="button"
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 py-3 px-8 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        Write a review
      </button>

      <Modal
        setOpen={setReviewModalOpen}
        isOpen={isReviewModalOpen}
        title={"Review"}
      >
        <form onSubmit={handleSubmit(handleAddReview)}>
          <div className="space-y-3">
            <textarea
              {...register("content")}
              className="w-full resize-none p-2 border border-gray-300 rounded-md focus:border-black  focus:ring-black"
              rows={10}
              placeholder="Write a review.."
            ></textarea>
            <div className="flex justify-center">
              <Button isLoading={isLoading} type={"submit"} colour="blue">
                Add Review
              </Button>
            </div>
            <div className="text-red-600 flex justify-center">
              {errors.content && <p>{errors.content.message}</p>}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

function Rating({
  venueRating,
  venueId,
}: {
  venueRating: number | undefined;
  venueId: string;
}) {
  //State, queries and mutations
  const { isLoggedIn, handleLoggedIn } = useAuthContext();
  const [rating, setRating] = useState<number | undefined>(venueRating);
  const queryClient = useQueryClient();
  const { data: ratingData } = useQuery<RatingMutationData, any, any>(
    ["rating", venueId],
    () => client.get(`venues/${venueId}/rating`),
    {
      enabled: isLoggedIn,
    }
  );
  const { mutateAsync } = useMutation<void, any, RatingMutationData>({
    mutationFn: (data: RatingMutationData) =>
      client.post(`venues/${venueId}/rate`, data),
    mutationKey: ["rate_venue"],
  });

  //Component specific logic
  async function setRatingHandler(rating: number) {
    try {
      if (handleLoggedIn) handleLoggedIn();
      setRating(rating);
      const ratingData: RatingMutationData = {
        rating: rating + 1,
      };
      await mutateAsync(ratingData);
      queryClient.invalidateQueries(["rating", venueId]);
      queryClient.invalidateQueries(["venue", venueId]);
      queryClient.invalidateQueries(["reviews", venueId]);
    } catch (error) {
      console.log(error);
    }
  }
  interface UserRatingInterface {
    average_rating: number;
    my_rating: string;
  }
  const userRatingObject: UserRatingInterface = ratingData?.data?.data?.rating;

  return (
    <div className="flex flex-row justify-between">
      <h3 className="sr-only">Reviews</h3>
      <div className="pt-2 pb-6">
        <p>Rate this venue</p>
        <button className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              onClick={() => setRatingHandler(rating)}
              key={rating}
              className={clsx(
                venueRating && Math.round(venueRating) > rating
                  ? "text-yellow-400"
                  : "text-gray-300",
                "h-5 w-5 flex-shrink-0 hover:text-yellow-700"
              )}
              aria-hidden="true"
            />
          ))}
          {venueRating && <span className="pl-1">({venueRating})</span>}
        </button>
      </div>
      <div className="pt-2 pb-6">
        {userRatingObject?.my_rating && isLoggedIn && (
          <>
            <p>Your rating</p>
            <div className="flex items-center">
              {Array.from(Array(userRatingObject.my_rating).keys()).map(
                (rating) => (
                  <StarIcon
                    key={rating}
                    className={clsx(
                      userRatingObject.my_rating ? "text-yellow-400" : "",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Reviews({ id }: { id: string }) {
  //get venue reviews
  const { data } = useQuery<ReviewsData>(["reviews", id], () =>
    client.get(`venues/${id}/reviews`)
  );
  const reviews = data?.data.data;

  return (
    <div className="mx-auto mt-10 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
      <Tab.Group as="div">
        <div className="border-b border-gray-200">
          <Tab.List className="-mb-px flex space-x-8">
            <Tab
              className={({ selected }) =>
                clsx(
                  selected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                  "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                )
              }
            >
              Customer Reviews
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="-mb-10">
            <h3 className="sr-only">Customer Reviews</h3>

            {reviews && reviews?.length > 0 ? (
              reviews?.map((review, reviewIdx) => (
                <div key={review.id} className="flex  text-sm text-gray-500">
                  <div className="flex-none py-10 pr-2">
                    <AvatarIcon imageUrl={review.user.avatar_url} />
                  </div>
                  <div
                    className={clsx(
                      reviewIdx === 0 ? "" : "w-full border-t border-gray-200",
                      "py-10"
                    )}
                  >
                    <h3 className="font-medium text-gray-900">
                      {review.user.username}
                    </h3>
                    <p>
                      <time dateTime={review.created_at}>
                        {new Date(review.created_at).toDateString()}
                      </time>
                    </p>

                    <div className="mt-4 flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={clsx(
                            review?.rating?.rating?.my_rating > rating
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <div
                      className="prose prose-sm mt-4 max-w-none text-gray-500"
                      dangerouslySetInnerHTML={{ __html: review.content }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="font-bold flex justify-center p-10 text-gray-500">
                There are no reviews for this venue yet.
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export async function getServerSideProps(context: { query: { id: number } }) {
  return {
    props: {
      id: context.query.id,
    },
  };
}
