import { cn } from "@/lib/utils";

interface TabTriggerProps {
  className?: string;
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const TabTrigger = ({
  className,
  active,
  onClick,
  children,
}: TabTriggerProps) => {
  return (
    <button
      className={cn("w-18 h-10", active && "border-b-[3px]", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabTrigger;
