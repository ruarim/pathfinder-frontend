import React from "react";

type Props = {};

export default function Footer({}: Props) {
  //@TODO
  return (
    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
        <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
          &copy; 2022 Pathfinder, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
