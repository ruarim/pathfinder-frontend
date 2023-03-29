import { useForm } from "react-hook-form";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useEffect, useState } from "react";
import LoadingButton from "../../components/LoadingButton";
import { useGetUser } from "../../hooks/queries/getUser";
import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import { Dispatch, Fragment, SetStateAction } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function Create() {
  const { isLoggedIn } = useAuthContext();
  const { data: userData } = useGetUser();
  const user = userData?.data.user;

  return isLoggedIn && user?.is_admin === 1 ? (
    <CreateVenueForm />
  ) : (
    <div className="font-bold text-2xl flex items-center justify-center h-screen">
      YOU ARE NOT AN ADMIN
    </div>
  );
}

type AddressMutation = {
  address_1: string;
  address_2?: string;
  town_city: string;
  postcode: string;
  country: string;
};

type CreateVenueData = {
  name: string;
  capacity: number;
  venue_type: "Pub" | "Bar" | "Resturant";
  opening_time: string;
  closing_time: string;
  description: string;
  address: AddressMutation;
  attributes: string[];
  beverages: [];
  images: string[];
};

function CreateVenueForm() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<CreateVenueData>();

  //move into images field component
  const [indexes, setIndexes] = useState<number[]>([]);
  const [counter, setCounter] = useState(0);

  const addImage = () => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeImage = (index: number) => () => {
    setIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    setCounter((prevCounter) => prevCounter - 1);
  };

  const clearImages = () => {
    setIndexes([]);
    setCounter(0);
  };

  const { mutateAsync: createVenue } = useMutation<
    Venue,
    unknown,
    CreateVenueData
  >((data) => client.post("/venues", data));

  const onSubmit = async (data: CreateVenueData) => {
    try {
      await createVenue(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your venue
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Venue Name
                </label>
                <div className="mt-1">
                  <input
                    {...register("name", { required: true })}
                    placeholder="First name"
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="mt-1">
                  {/* <input
                    {...register("venue_type", { required: true })}
                    placeholder="First name"
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  /> */}
                  <VenueTypePicker />
                </div>
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <div className="mt-1">
                  <input
                    {...register("capacity")}
                    placeholder="Capacity"
                    id="capacity"
                    name="capacity"
                    type="number"
                    autoComplete="capacity"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <div className="pr-20">
                  <label
                    htmlFor="openingTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Opening Time
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("opening_time")}
                      id="opening_time"
                      name="opening_time"
                      type="time"
                      autoComplete="opening_time"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="pr-20">
                  <label
                    htmlFor="closingTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Closing Time
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("opening_time")}
                      id="closing_time"
                      name="closing_time"
                      type="time"
                      autoComplete="closing_time"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="address1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address 1
                </label>
                <div className="mt-1">
                  <input
                    {...register("address.address_1")}
                    placeholder="Address Line 1"
                    id="address_1"
                    name="address_1"
                    autoComplete="address_1"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="address2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address 2
                </label>
                <div className="mt-1">
                  <input
                    {...register("address.address_2")}
                    placeholder="Address Line 2"
                    id="address_2"
                    name="address_2"
                    autoComplete="address_2"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="townCity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Town/City
                </label>
                <div className="mt-1">
                  <input
                    {...register("address.town_city")}
                    placeholder="Town or City"
                    id="town_city"
                    name="town_city"
                    autoComplete="town_city"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="postcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postcode
                </label>
                <div className="mt-1">
                  <input
                    {...register("address.postcode")}
                    placeholder="Postcode"
                    id="postcode"
                    name="postcode"
                    autoComplete="postcode"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <input
                    {...register("address.country")}
                    placeholder="Country"
                    id="country"
                    name="country"
                    autoComplete="country"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    {...register("description")}
                    placeholder="Description"
                    id="description"
                    name="description"
                    autoComplete="description"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                {indexes.map((index) => {
                  const fieldName = `images[${index}]`;
                  return (
                    <fieldset name={fieldName} key={fieldName}>
                      <div className="pb-3">
                        <div>
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Image Url {index + 1}
                          </label>
                          <div className="flex">
                            <div className="mt-1 w-full">
                              <input
                                {...register(`images.${index}`)}
                                placeholder="Image Url"
                                id={`image${index}`}
                                name={`image${index}`}
                                autoComplete={`image${index}`}
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={removeImage(index)}
                              className="bg-red-100 text-red-800 p-1 px-2 rounded-lg ml-2 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  );
                })}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addImage}
                    className="bg-blue-100 text-blue-800 p-3 rounded-lg mr-2"
                  >
                    Add Image
                  </button>
                  <button
                    type="button"
                    onClick={clearImages}
                    className="bg-blue-100 text-blue-800 p-3 rounded-lg ml-2"
                  >
                    Clear Images
                  </button>
                </div>
              </div>

              <div>
                <LoadingButton
                  type="submit"
                  styles="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 p-3 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Venue
                </LoadingButton>
              </div>
              {/* <div className="text-red-600">
                {errors.password && <p>{errors.password.message}</p>}
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function VenueTypePicker() {
  const types = ["Pub", "Bar", "Resturant"];

  const [type, setType] = useState("");

  useEffect(() => {
    //save value on change
  }, [type]);

  return (
    <div className="space-y-1">
      <label className="grid grid-cols-1 text-sm">Venue Type</label>
      <div className="text-lg rounded-md">
        <DropDown options={types} value={type} setValue={setType} />
      </div>
    </div>
  );
}

function DropDown({
  setValue,
  value,
  options,
}: {
  options: string[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="w-24 h-9 inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {value != "" ? value : "--"}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-24  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => setValue(option)}
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    {option}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
