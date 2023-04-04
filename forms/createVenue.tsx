import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import client from "../axios/apiClient";
import Field from "../components/form/Field";
import FieldArrayInput from "../components/form/ArrayInput";
import LineInput from "../components/form/LineInput";
import TextArea from "../components/form/TextArea";
import VenueTypePicker from "../components/form/VenueTypePicker";
import LoadingButton from "../components/LoadingButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  const VenueSchema = yup.object().shape({
    name: yup.string().required("Venue must have a name"),
    venue_type: yup
      .string<"Pub" | "Bar" | "Resturant">()
      .required("Venue must have a type"),
    capacity: yup.string().required("Venue must have a capacity"),
    opening_time: yup.string().required("Venue opening time cannot be empty"),
    closing_time: yup.string().required("Venue closing time cannot be empty"),
    address: yup.object({
      address_1: yup.string().required("Venue must have an address 1"),
      address_2: yup.string().nullable(),
      postcode: yup.string().required("Venue must have an postcode"),
      town_city: yup.string().required("Venue must have an town or city"),
      country: yup.string().required("Venue must have a country"),
    }),
    description: yup.string().required("Give the venue a description"),
    attributes: yup
      .array()
      .of(yup.string().required("Add an attribute").min(2, "add an attribute"))
      .required("Must have attributes")
      .min(1, "Add at least one attribute")
      .test({ message: "Add an attribute", test: (arr) => arr[0]?.length > 1 }),
    images: yup
      .array()
      .of(yup.string().required("Add an image").min(2, "Add an image url"))
      .required("Must have images")
      .min(1, "Add at least one image")
      .test({ message: "Add an image", test: (arr) => arr[0]?.length > 1 }),
  });
  const form = useForm<CreateVenueData>({ resolver: yupResolver(VenueSchema) });
  const {
    formState: { errors },
  } = form;

  const { mutateAsync: createVenue, isLoading } = useMutation<
    Venue,
    unknown,
    CreateVenueData
  >((data) => client.post("/venues", data));

  const router = useRouter();

  const onSubmit = async (data: CreateVenueData) => {
    try {
      await createVenue(data);
      router.push("/admin/venues");
    } catch (e) {
      console.log(e);
    }
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
                <Field error={errors.name?.message}>
                  <LineInput
                    defaultValue=""
                    placeholder="Venue name"
                    name="name"
                    type="text"
                    label="Venue Name"
                  />
                </Field>

                <Field error={errors.venue_type?.message}>
                  <div className="mt-1">
                    <VenueTypePicker name="venue_type" label="Venue Type" />
                  </div>
                </Field>

                <Field error={errors.capacity?.message}>
                  <LineInput
                    placeholder="Capacity"
                    name="capacity"
                    type="number"
                    label="Capacity"
                  />
                </Field>

                <div className="grid grid-cols-2 space-x-2">
                  <Field error={errors.opening_time?.message}>
                    <LineInput
                      name="opening_time"
                      type="time"
                      label="Opening Time"
                    />
                  </Field>
                  <Field error={errors.closing_time?.message}>
                    <LineInput
                      name="closing_time"
                      type="time"
                      label="Closing Time"
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <label>Venue Address</label>
                  <Field error={errors.address?.address_1?.message}>
                    <LineInput
                      name="address.address_1"
                      type="text"
                      label="Address 1"
                      placeholder="Address line 1"
                    />
                  </Field>
                  <Field error={errors.address?.address_2?.message}>
                    <LineInput
                      name="address.address_2"
                      type="text"
                      label="Address 2"
                      placeholder="Address line 2"
                    />
                  </Field>

                  <Field error={errors.address?.town_city?.message}>
                    <LineInput
                      name="address.town_city"
                      type="text"
                      label="Town/City"
                      placeholder="Town or City"
                    />
                  </Field>

                  <Field error={errors.address?.postcode?.message}>
                    <LineInput
                      name="address.postcode"
                      type="text"
                      label="Postcode"
                      placeholder="Postcode"
                    />
                  </Field>

                  <Field error={errors.address?.country?.message}>
                    <LineInput
                      name="address.country"
                      type="text"
                      label="Country"
                      placeholder="Country"
                    />
                  </Field>
                </div>

                <Field error={errors.description?.message}>
                  <TextArea
                    name="description"
                    label="Venue Description"
                    placeholder="Describe your venue"
                  />
                </Field>

                <Field className="space-y-2" error={errors.attributes?.message}>
                  <label>
                    Attributes (Eg. Pool Table, Real Ale, Live Music)
                  </label>
                  <FieldArrayInput label="Attribute" name="attributes" />
                </Field>

                <Field className="space-y-2" error={errors.images?.message}>
                  <label>Images</label>
                  <FieldArrayInput label="Image Url" name="images" />
                </Field>
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
