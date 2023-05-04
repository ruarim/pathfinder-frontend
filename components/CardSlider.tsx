import { Transition } from "@headlessui/react";
import { Children, useLayoutEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
}

function CardSlider({ children }: Props) {
  const container = useRef();
  const items = useRef([]);
  const [containerHeight, setContainerHeight] = useState();

  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    const tallestItems = items.current
      .map((el) => el.clientHeight)
      .sort((a, b) => b - a)[0];

    setContainerHeight(tallestItems);
  }, []);

  function goTo(index: number) {
    setCurrentIndex(index);
  }

  return (
    <div>
      <div
        className="relative"
        ref={container}
        style={{ height: containerHeight ? containerHeight : "auto" }}
      >
        {Children.map(children, (child, index) => (
          <div
            ref={(ref) => (items.current[index] = ref)}
            className={`${
              typeof containerHeight !== "undefined" && "absolute inset-0"
            }`}
          >
            <Transition
              className="h-full [&>div]:h-full"
              show={
                typeof containerHeight === "undefined"
                  ? true
                  : currentIndex === index
              }
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {child}
            </Transition>
          </div>
        ))}
      </div>

      {Children.count(children) > 1 && (
        <div className="flex justify-between mt-4">
          <div
            onClick={() => {
              if (currentIndex != 0) {
                goTo(currentIndex - 1);
              }
            }}
          >
            {Arrow}
          </div>
          <div className="flex">
            {Children.map(children, (_, index) => (
              <button
                key={`nav-${index}`}
                className="block p-4"
                onClick={() => goTo(index)}
              >
                <span
                  className={`block w-4 h-4 rounded-full ${
                    index === currentIndex ? "bg-purple-600" : "bg-stone-300"
                  }`}
                >
                  <span className="sr-only">{index}</span>
                </span>
              </button>
            ))}
          </div>
          <div
            className="rotate-180"
            onClick={() => {
              if (currentIndex != Children.count(children) - 1) {
                goTo(currentIndex + 1);
              }
            }}
          >
            {Arrow}
          </div>
        </div>
      )}
    </div>
  );
}

const Arrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 py-3 bg-stone-100 hover:bg-stone-200 rounded-lg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);
export default CardSlider;
