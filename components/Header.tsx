import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAuthContext } from "../hooks/context/useAuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "./Modal";
import Login from "./Login";
import Register from "./Register";
import AvatarIcon from "./AvatarIcon";
import { useGetUser } from "../hooks/queries/getUser";

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
    <Link
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
    </Link>
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
            className="block w-full px-4 py-2 text-base font-medium text-primary/700 hover:bg-gray-100 hover:text-primary"
            key={link.href}
          >
            {link.name}
          </Disclosure.Button>
        );
      })}
    </>
  );
}

function ProfileDropDown() {
  const { logout, isLoggedIn, setLoginModalOpen, setRegisterModalOpen } =
    useAuthContext();
  const { data: userData } = useGetUser();
  const user = userData?.data.user;

  function logoutHandler() {
    logout && logout();
  }
  return isLoggedIn ? (
    <div className="flex justify-end pr-4 lg:pr-0">
      <Menu as="div" className="relative ml-4 flex-shrink-0">
        <div>
          <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none ">
            <span className="sr-only">Open user menu</span>
            <AvatarIcon imageUrl={user?.avatar_url} />
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
            {isLoggedIn && (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={logoutHandler}
                      className={clsx(
                        active
                          ? "bg-green-400/50  cursor-pointer"
                          : "bg-blue-400/50",
                        "block px-4 py-2 text-sm text-primary/50"
                      )}
                    >
                      Log Out
                    </div>
                  )}
                </Menu.Item>
                {user && user?.is_admin === 1 && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/admin"
                        className={clsx(
                          active
                            ? "bg-green-400/50  cursor-pointer"
                            : "bg-blue-400/50",
                          "block px-4 py-2 text-sm text-primary/50"
                        )}
                      >
                        Admin
                      </Link>
                    )}
                  </Menu.Item>
                )}
              </>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  ) : (
    <div className="mx-4 space-x-4">
      <button
        className="hover:underline"
        onClick={() => {
          if (setLoginModalOpen) setLoginModalOpen(true);
        }}
      >
        Sign In
      </button>
      <button
        className="bg-contrast/75 hover:bg-contrast p-3 px-7 rounded-full"
        onClick={() => {
          if (setRegisterModalOpen) setRegisterModalOpen(true);
        }}
      >
        Register
      </button>
    </div>
  );
}

export default function Header() {
  const {
    loginModalOpen,
    registerModalOpen,
    setLoginModalOpen,
    setRegisterModalOpen,
  } = useAuthContext();

  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
  }, []);

  return (
    <div>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Link
                      href={"/"}
                      className="text-2xl font-bold  max-[800px]:hidden pt-4 p-3 px-"
                    >
                      Pathfinder
                    </Link>
                  </div>
                  <div className="grid gap-3 max-[600px]:hidden grid-cols-4 px-4">
                    {navigation.map((link) => {
                      return (
                        <DesktopNavLink
                          key={link.name}
                          href={link.href}
                          name={link.name}
                        />
                      );
                    })}
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-2xl font-bold absolute min-[601px]:hidden pt-4"
                >
                  Pathfinder
                </Link>
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
                {windowWidth > 1023 && (
                  <div className="hidden lg:ml-4 lg:flex lg:items-center">
                    <ProfileDropDown />
                  </div>
                )}
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              {windowWidth <= 1023 && (
                <>
                  <div className="space-y-1 pt-2 pb-3">
                    <MobileNavLink />
                  </div>
                  <div className="border-t border-gray-200 pt-4 pb-3">
                    <ProfileDropDown />
                  </div>
                </>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {loginModalOpen && setLoginModalOpen && (
        <div>
          <Modal
            setOpen={setLoginModalOpen}
            isOpen={loginModalOpen}
            title={"Login"}
          >
            <Login />
          </Modal>
        </div>
      )}
      {registerModalOpen && setRegisterModalOpen && (
        <Modal
          setOpen={setRegisterModalOpen}
          isOpen={registerModalOpen}
          title={"Register"}
        >
          <Register />
        </Modal>
      )}
    </div>
  );
}
