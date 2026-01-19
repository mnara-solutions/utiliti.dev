import { Dialog, DialogPanel } from "@headlessui/react";
import Sidebar from "~/components/sidebar";

interface Props {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

export default function MobileSidebar({ open, setOpen }: Props) {
  return (
    <Dialog
      open={open}
      onClose={setOpen}
      as="div"
      className="relative z-40 md:hidden"
    >
      <div className="fixed inset-0 z-40 flex top-14">
        <DialogPanel
          transition
          className="relative flex w-full flex-1 flex-col bg-zinc-900 pt-5 pb-4 transition ease-in-out duration-300 transform data-[closed]:-translate-x-full"
        >
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              <Sidebar />
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
