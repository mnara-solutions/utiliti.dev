import { Fragment, useCallback, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/common";
import { navigation } from "~/components/sidebar";

const utilities = navigation.flatMap((it) => it.children);

interface Props {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
}

export default function Search({ open, setOpen }: Props) {
  const [query, setQuery] = useState("");

  const filteredUtilities =
    query === ""
      ? []
      : utilities.filter((it) => {
          return it.name.toLowerCase().includes(query.toLowerCase());
        });

  const onChange = useCallback((item: (typeof utilities)[0]) => {
    window.location.href = item.url;
  }, []);

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-black/40 opacity-100" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all">
              <Combobox onChange={onChange}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === "" || filteredUtilities.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                  >
                    <li className="p-2">
                      <ul className="text-sm text-gray-400">
                        {(query === "" ? utilities : filteredUtilities).map(
                          (it) => (
                            <Combobox.Option
                              key={it.name}
                              value={it}
                              className={({ active }) =>
                                classNames(
                                  "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                  active && "bg-zinc-800 text-orange-600"
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <span className="ml-3 flex-auto truncate">
                                    {it.name}
                                  </span>
                                  {active && (
                                    <span className="ml-3 flex-none text-gray-400">
                                      Jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          )
                        )}
                      </ul>
                    </li>
                  </Combobox.Options>
                )}

                {query !== "" && filteredUtilities.length === 0 && (
                  <div className="py-14 px-6 text-center sm:px-14">
                    <p className="text-sm text-gray-200">
                      We couldn't find any utilities with that term.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
