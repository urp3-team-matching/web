import { cn } from "@/lib/utils";
import BottomHeaderBox from "./BottomHeaderBox";
import TopHeaderBox from "./TopHeaderBox";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <div
      className={cn(
        "w-full h-auto flex flex-col border-b-[1px] border-b-gray-300",
        className
      )}
    >
      <TopHeaderBox />
      <BottomHeaderBox />
    </div>
  );
};

export default Header;
