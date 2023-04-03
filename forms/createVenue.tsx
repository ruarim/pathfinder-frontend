import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import client from "../axios/apiClient";
import Field from "../components/form/Field";
import FieldArrayInput from "../components/form/ImagesArrayInput";
import LineInput from "../components/form/LineInput";
import TextArea from "../components/form/TextArea";
import VenueTypePicker from "../components/form/VenueTypePicker";
import LoadingButton from "../components/LoadingButton";

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

export default function CreateVenueForm() {
  const [isLoading, setLoading] = useState(false);
  const form = useForm<CreateVenueData>();
  const { mutateAsync: createVenue } = useMutation<
    Venue,
    unknown,
    CreateVenueData
  >((data) => client.post("/venues", data));

  const router = useRouter();

  const onSubmit = async (data: CreateVenueData) => {
    setLoading(true);
    try {
      await createVenue(data);
      router.push("/admin/venues");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your venue
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <FormProvider {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Field>
                  <LineInput
                    defaultValue=""
                    placeholder="Venue name"
                    name="name"
                    type="text"
                    label="Venue Name"
                  />
                </Field>

                <div>
                  <div className="mt-1">
                    <VenueTypePicker name="venue_type" label="Venue Type" />
                  </div>
                </div>

                <Field>
                  <LineInput
                    placeholder="Capacity"
                    name="capacity"
                    type="number"
                    label="Capacity"
                  />
                </Field>

                <div className="grid grid-cols-2 space-x-2">
                  <Field>
                    <LineInput
                      name="opening_time"
                      type="time"
                      label="Opening Time"
                    />
                  </Field>
                  <Field>
                    <LineInput
                      name="closing_time"
                      type="time"
                      label="Closing Time"
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <label>Venue Address</label>
                  <Field>
                    <LineInput
                      name="address.address_1"
                      type="text"
                      label="Address 1"
                      placeholder="Address line 1"
                    />
                  </Field>
                  <Field>
                    <LineInput
                      name="address.address_2"
                      type="text"
                      label="Address 2"
                      placeholder="Address line 2"
                    />
                  </Field>

                  <Field>
                    <LineInput
                      name="address.town_city"
                      type="text"
                      label="Town/City"
                      placeholder="Town or City"
                    />
                  </Field>

                  <Field>
                    <LineInput
                      name="address.postcode"
                      type="text"
                      label="Postcode"
                      placeholder="Postcode"
                    />
                  </Field>

                  <Field>
                    <LineInput
                      name="address.country"
                      type="text"
                      label="Country"
                      placeholder="Country"
                    />
                  </Field>
                </div>

                <Field>
                  <TextArea
                    name="description"
                    label="Venue Description"
                    placeholder="Describe your venue"
                  />
                </Field>

                <div className="space-y-2">
                  <label>
                    Attributes (Eg. Pool Table, Real Ale, Live Music)
                  </label>
                  <FieldArrayInput label="Attribute" name="attributes" />
                </div>

                <div className="space-y-2">
                  <label>Images</label>
                  <FieldArrayInput label="Image Url" name="images" />
                </div>
                <div>
                  <LoadingButton
                    isLoading={isLoading}
                    type="submit"
                    styles="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 p-3 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create Venue
                  </LoadingButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}
