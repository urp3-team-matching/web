import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CancelAndSubmitButtonProps {
  onCancel: () => void;
  className?: string;
}

const CancelAndSubmitButton = ({
  onCancel,
  className,
}: CancelAndSubmitButtonProps) => {
  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {/* 취소 버튼 */}
      <button
        onClick={onCancel}
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
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose className="bg-white text-black">취소</DialogClose>
            <Button type="submit" className="bg-secondary-100">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancelAndSubmitButton;
