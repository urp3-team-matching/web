import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import { Tab } from "@/app/projects/[id]/_components/RightPanel/Chat";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  className?: string;
  tab: Tab | null;
  setTab: (tab: Tab | null) => void;
  mode: ProjectPageMode;
}

const ChatHeader = ({ className, tab, setTab, mode }: ChatHeaderProps) => {
  return (
    <div
      className={cn(
        "w-full *:w-16 *:text-center *:cursor-pointer border-b-2 flex justify-center gap-5 h-10 items-center",
        className
      )}
    >
      <button
        onClick={() => setTab(null)}
        type="button"
        className={
          mode === ProjectPageModeEnum.ADMIN && tab === null
            ? "text-secondary"
            : ""
        }
      >
        대화방
      </button>
      {mode === ProjectPageModeEnum.ADMIN && (
        <button
          onClick={() => setTab(Tab.모집관리)}
          type="button"
          className={
            mode === ProjectPageModeEnum.ADMIN && tab === Tab.모집관리
              ? "text-secondary"
              : ""
          }
        >
          모집 관리
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
