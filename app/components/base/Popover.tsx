import { Popover } from "@base-ui-components/react/popover";
import { useForceActive } from "../../lib/useForceActive";
import { Icon } from "./Icon";

type BasePopoverProps = {
  description?: React.ReactNode;
};

export default function BasePopover({ description }: BasePopoverProps) {
  const [triggerRef, forceActiveHandlers] =
    useForceActive<HTMLButtonElement>(150);
  return (
    <Popover.Root>
      <Popover.Trigger
        ref={triggerRef}
        className="foundation-button interactive-ghost size-8 border border-surface button-rounded"
        {...forceActiveHandlers}
      >
        <Icon icon="Bell" aria-label="Notificações" className="w-3 h-3" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="surface elevation-high border-surface border-thin rounded-md shadow-2xl p-4 min-w-[220px]">
            <Popover.Arrow className="block" />
            <Popover.Title className="typo heading-3 font-semibold mb-1">
              Notificações
            </Popover.Title>
            <Popover.Description className="typo body-md text-tertiary">
              {description || "Você está em dia. Bom trabalho!"}
            </Popover.Description>
            <Popover.Close />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
