import React from "react";
import Button from "../Button";

interface ListItemProps {
  children: React.ReactNode;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  buttonLabel = "Ação",
  buttonIcon,
  onButtonClick,
  buttonProps,
}) => {
  return (
    <div className="interactive flex items-center justify-between px-3 py-2 border-b border-surface gap-2 select-none">
      <div className="flex-1 min-w-0 truncate">{children}</div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onButtonClick}
        {...buttonProps}
      >
        {buttonIcon ? buttonIcon : buttonLabel}
      </Button>
    </div>
  );
};

export default ListItem;
