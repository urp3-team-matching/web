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
import { useState } from "react";

interface CancelAndSubmitButtonProps {
  onDelete: () => void;
  onSubmit: () => void;
  onToggleClose: () => void;
  isProjectClosed?: boolean;
  className?: string;
  loading?: boolean;
}

const CancelAndSubmitButton = ({
  onDelete,
  onSubmit,
  onToggleClose,
  className,
  loading = false,
  isProjectClosed = false,
}: CancelAndSubmitButtonProps) => {
  const [isDialogOpen, setDialogIsOpen] = useState(false);

  return (
    <div className={cn("flex w-full justify-between gap-2", className)}>
      {/* 취소 버튼 */}
      <Button
        onClick={onDelete}
        type="button"
        className="text-white flex-1 cursor-pointer text-base font-normal  h-10 bg-red-400 hover:bg-red-300 rounded-lg"
      >
        삭제
      </Button>
      <Button
        type="button"
        onClick={onToggleClose}
        className="text-white flex-1 cursor-pointer text-base font-normal  h-10 bg-orange-400 hover:bg-orange-300 rounded-lg"
      >
        {isProjectClosed ? "재모집" : "모집마감"}
      </Button>

      {/* 저장 버튼 */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogIsOpen}>
        <DialogTrigger asChild disabled={loading}>
          <Button className="text-white flex-1 flex justify-center items-center cursor-pointer text-base font-normal h-10 bg-secondary hover:bg-secondary/90 rounded-lg">
            저장
          </Button>
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
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
                setDialogIsOpen(false);
              }}
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
