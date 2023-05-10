import { Tab, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Children } from "react";

interface Props {
  children: React.ReactNode;
  onSelect?: () => void;
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
}

function CardSlider({
  children,
  onSelect,
  currentIndex,
  setCurrentIndex,
}: Props) {
  function goTo(index: number) {
    setCurrentIndex(index);
    onSelect?.();
  }

  return (
    <div className="flex flex-col">
      <Tab.Group selectedIndex={currentIndex}>
        <Tab.Panels className="flex-1">
          {Children.map(children, (child, index) => (
            <Tab.Panel key={index}>
              <Transition
                className="h-full [&>div]:h-full"
                show={true}
                enter="transition-opacity duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {child}
              </Transition>
            </Tab.Panel>
          ))}
        </Tab.Panels>

        <Tab.List className="flex-none">
          {Children.count(children) > 1 && (
            <div className="flex justify-between mt-2">
              <div
                onClick={() => {
                  if (currentIndex != 0) {
                    goTo(currentIndex - 1);
                  }
                }}
              >
                {LeftArrow}
              </div>

              <div className="flex">
                {Children.map(children, (_, index) => (
                  <Tab
                    key={`nav-${index}`}
                    className="block p-4"
                    onClick={() => goTo(index)}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full ${
                        index === currentIndex
                          ? "bg-purple-600"
                          : "bg-stone-300"
                      }`}
                    >
                      <span className="sr-only">{index}</span>
                    </span>
                  </Tab>
                ))}
              </div>
              <div
                onClick={() => {
                  if (currentIndex != Children.count(children) - 1) {
                    goTo(currentIndex + 1);
                  }
                }}
              >
                <div>{RightArrow}</div>
              </div>
            </div>
          )}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}

const LeftArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 py-3 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center"
  >
    <ChevronLeftIcon />
  </svg>
);

const RightArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 py-3 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center"
  >
    <ChevronRightIcon />
  </svg>
);
export default CardSlider;
