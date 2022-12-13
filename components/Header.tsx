import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAuthContext } from "../hooks/context/useAuthContext";
import { useRouter } from "next/router";
import client from "../axios/apiClient";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Venues",
    href: "/venues",
  },
  {
    name: "Plans",
    href: "/plans",
  },
  {
    name: "Favourites",
    href: "/favourites",
  },
];

function DesktopNavLink({ name, href }: { name: string; href: string }) {
  const router = useRouter();
  return (
    <a
      {...{ href }}
      className="relative mt-4 my-2 px-6 py-2 font-bold text-primary group"
    >
      <span
        className={clsx(
          router.pathname === href
            ? "bg-transparent"
            : "transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-notice/50 group-hover:translate-x-0 group-hover:translate-y-0",
          "absolute inset-0"
        )}
      ></span>
      <span className="absolute inset-0 border-2 border-primary"></span>
      <span className="relative">{name}</span>
    </a>
  );
}

function MobileNavLink() {
  return (
    <>
      {navigation.map((link) => {
        return (
          <Disclosure.Button
            as="a"
            href={link.href}
            className="block px-4 py-2 text-base font-medium text-primary/700 hover:bg-gray-100 hover:text-primary"
          >
            {link.name}
          </Disclosure.Button>
        );
      })}
    </>
  );
}

export default function Header() {
  const { logout, isLoggedIn } = useAuthContext();

  function logoutHandler() {
    client.post("logout");
    logout && logout();
  }
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  {/* Logo goes here */}
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  {navigation.map((link) => {
                    return <DesktopNavLink href={link.href} name={link.name} />;
                  })}
                </div>
              </div>

              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-primary/50 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {!isLoggedIn && (
                        <>
                          {" "}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/login"
                                className={clsx(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-primary/50"
                                )}
                              >
                                Login
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/register"
                                className={clsx(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-primary/50"
                                )}
                              >
                                Register
                              </a>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      {isLoggedIn && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={clsx(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-primary/50"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={clsx(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-primary/50"
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={logoutHandler}
                                className={clsx(
                                  active
                                    ? "bg-green-400/50  cursor-pointer"
                                    : "bg-blue-400/50",
                                  "block px-4 py-2 text-sm text-primary/50"
                                )}
                              >
                                Log Out
                              </a>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pt-2 pb-3">
              <MobileNavLink />
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
