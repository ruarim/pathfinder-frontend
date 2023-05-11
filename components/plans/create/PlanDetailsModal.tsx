import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";
import Datepicker from "react-tailwindcss-datepicker";
import DropDown from "../../Dropdown";

import Button from "../../Button";

interface PlanDetailsModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  onSave: (
    name: string,
    start_date: string | undefined,
    start_time: string | undefined
  ) => void;
  isLoading: boolean;
}
type TimeType = {
  hour: string;
  minute: string;
};

export default function PlanDetailsModal({
  isOpen,
  setOpen,
  onSave,
  isLoading,
}: PlanDetailsModalProps) {
  const [planName, setPlanName] = useState<string>("");
  const [dateValue, setDateValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [timeValue, setTimeValue] = useState<TimeType>({
    hour: "",
    minute: "",
  });

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
  };
  const handleTimeChange = (newValue: TimeType) => {
    setTimeValue(newValue);
  };

  const startDate = dateValue?.startDate?.toString();
  const startTime =
    timeValue.hour != "" && timeValue.minute != ""
      ? `${timeValue.hour}:${timeValue.minute}`
      : undefined;

  return (
    <Modal isOpen={isOpen} setOpen={setOpen} title="Plan Details">
      <div className="flex-wrap space-y-5 pt-2">
        <div className="flex space-x-2">
          <div className="space-y-1">
            <label>Start date</label>
            <Datepicker
              inputClassName={"border border-gray-300 h-9 text-base"}
              useRange={false}
              asSingle={true}
              value={dateValue}
              onChange={handleDateChange}
            />
          </div>
          <TimePicker onChange={handleTimeChange} />
        </div>
        <div className="space-y-1">
          <label>Plan name</label>
          <input
            className="block h-12 w-full appearance-none rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm  text-md"
            placeholder="Enter a name..."
            type="text"
            onChange={(e) => setPlanName(e.currentTarget.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => onSave(planName, startDate, startTime)}
            isLoading={isLoading}
            colour="blue"
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function TimePicker({ onChange }: { onChange: (newValue: TimeType) => void }) {
  const hours = [
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const minutes = ["00", "15", "30", "45"];
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  useEffect(() => {
    onChange({ hour, minute });
  }, [hour, minute]);

  return (
    <div className="space-y-1">
      <label className="grid grid-cols-1">Start Time</label>
      <div className="inline-flex text-lg rounded-md">
        <DropDown options={hours} value={hour} setValue={setHour} />
        <span className="px-2">:</span>
        <DropDown options={minutes} value={minute} setValue={setMinute} />
      </div>
    </div>
  );
}

interface ModalProps {
  setOpen: (value: boolean) => void;
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ setOpen, isOpen, title, children }: ModalProps) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative " onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-lg transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {
                  <div className="flex justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6"
                    >
                      {title}
                    </Dialog.Title>
                    <button>
                      <XMarkIcon
                        className="w-7 pb-2"
                        onClick={() => setOpen(false)}
                      />
                    </button>
                  </div>
                }

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
