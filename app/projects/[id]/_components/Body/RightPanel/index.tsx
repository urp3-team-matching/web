import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import Chat from "@/app/projects/[id]/_components/Body/RightPanel/Chat";
import ProposerField from "@/app/projects/[id]/_components/Body/RightPanel/ProposerField";
import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";

interface RightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
  toggleAdminMode: () => void;
}

const RightPanel = ({
  className,
  project,
  adminMode,
  toggleAdminMode,
}: RightPanelProps) => {
  return (
    <div className={cn("flex flex-col gap-5 h-auto mt-12", className)}>
      {!adminMode && <MajorGraph project={project} />}

      {/* 프로젝트 제안자 입력 */}
      {adminMode && (
        <ProposerField className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto" />
      )}

      {/* 프로젝트 대화방 및 모집관리 */}
      <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg  h-[500px]"
        project={project}
        adminMode={adminMode}
      />
      {!adminMode && <ProjectApplyButton />}

      {/* 프로젝트 취소 및 저장 버튼 */}
      {adminMode && (
        <div className="w-full flex justify-center gap-2 h-auto">
          {/* 취소 버튼 */}
          <button
            onClick={toggleAdminMode}
            type="button"
            className="text-black cursor-pointer text-base font-normal w-[100px] h-10 bg-slate-200 rounded-lg"
          >
            취소
          </button>

          {/* 저장 버튼 */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-white flex justify-center items-center cursor-pointer text-base font-normal w-[280px] h-10 bg-secondary-100 rounded-lg">
                저장
              </div>
            </DialogTrigger>
            <DialogContent className="w-56">
              <DialogTitle>저장하시겠습니까?</DialogTitle>
              <div className="flex ml-16">
                <DialogClose className="button bg-white text-black">
                  취소
                </DialogClose>
                <button type="submit" className="button bg-black text-white">
                  확인
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
