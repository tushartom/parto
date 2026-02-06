"use client";

import { Drawer } from "vaul";
import AdFormController from "@/components/supplier/AdFormController";

/**
 * @param {boolean} open - Controls visibility
 * @param {function} setOpen - State setter
 * @param {object} initialData - Pre-filled ad data for editing
 * @param {string} mode - 'create' or 'edit'
 */
export function AdSubmissionDrawer({
  open,
  setOpen,
  initialData,
  mode = "edit",
  metadata
}) {
  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Portal>
        {/* Overlay with a nice blur */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]" />

        <Drawer.Content className="bg-white flex flex-col rounded-t-[24px] h-[96dvh] fixed bottom-0 left-0 right-0 z-[101] outline-none">
          <Drawer.Title className="sr-only">
            {mode === "edit"
              ? "Edit Advertisement"
              : "Create New Advertisement"}
          </Drawer.Title>

          {/* 2. ACCESSIBILITY: Description for screen readers */}
          <Drawer.Description className="sr-only">
            Fill out the form below to update your spare part listing details.
          </Drawer.Description>
          {/* Draggable Handle */}
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 my-4" />

          <div className="flex-1 overflow-hidden">
            <AdFormController
              initialData={initialData}
              mode={mode}
              onClose={() => setOpen(false)}
              metadata={metadata}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
