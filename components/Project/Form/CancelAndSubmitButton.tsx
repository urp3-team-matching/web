import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
      <Button
        onClick={onCancel}
        type="button"
        className="text-black cursor-pointer text-base font-normal w-[100px] h-10 bg-slate-200 hover:bg-slate-200/90 rounded-lg"
      >
        취소
      </Button>

      {/* 저장 버튼 */}
      <Dialog aria-describedby="alert-dialog-description">
        <DialogTrigger asChild>
          <div className="text-white flex justify-center items-center cursor-pointer text-base font-normal w-[280px] h-10 bg-secondary hover:bg-secondary/90 rounded-lg">
            저장
          </div>
        </DialogTrigger>
        <DialogContent className="w-56">
          <DialogTitle>저장하시겠습니까?</DialogTitle>
          <DialogDescription className="sr-only">
            변경사항을 저장하시겠습니까?
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button className="text-black hover:cursor-pointer bg-slate-200 hover:bg-slate-200/90">
                취소
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 hover:cursor-pointer"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancelAndSubmitButton;
