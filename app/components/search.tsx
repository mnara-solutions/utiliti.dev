import { Fragment, useState } from "react";
import {
  Combobox,
  ComboboxOption,
  ComboboxOptions,
  ComboboxInput,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/common";
import { utilities } from "~/utilities";
import { useNavigate } from "react-router";

const allUtilities = Object.values(utilities);

interface Props {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
}

export default function Search({ open, setOpen }: Props) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredUtilities =
    query === ""
      ? []
      : allUtilities.filter((it) => {
          return it.name.toLowerCase().includes(query.toLowerCase());
        });

  const onChange = (item: (typeof allUtilities)[0]) => {
    setOpen(false);
    navigate(item.url);
  };

  return (
    <Transition
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-xs bg-black/40 opacity-100" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all">
              <Combobox onChange={onChange}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <ComboboxInput
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                    autoFocus={true}
                  />
                </div>

                {(query === "" || filteredUtilities.length > 0) && (
                  <ComboboxOptions
                    static={true}
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                  >
                    <li className="list-none p-2">
                      <ul className="text-sm text-gray-400">
                        {(query === "" ? allUtilities : filteredUtilities).map(
                          (it) => (
                            <ComboboxOption
                              key={it.name}
                              data-testid="search-option"
                              value={it}
                              className={({ focus }) =>
                                classNames(
                                  "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                  focus && "bg-zinc-800 text-orange-600",
                                )
                              }
                            >
                              {({ focus }) => (
                                <>
                                  <span className="ml-3 flex-auto truncate">
                                    {it.name}
                                  </span>
                                  {focus && (
                                    <span className="ml-3 flex-none text-gray-400">
                                      Jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </ComboboxOption>
                          ),
                        )}
                      </ul>
                    </li>
                  </ComboboxOptions>
                )}

                {query !== "" && filteredUtilities.length === 0 && (
                  <div className="py-14 px-6 text-center sm:px-14">
                    <p className="text-sm text-gray-200">
                      We couldn&apos;t find any utilities with that term.
                    </p>
                  </div>
                )}
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
