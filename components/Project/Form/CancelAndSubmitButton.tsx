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
  onSubmit: () => void;
  className?: string;
  loading?: boolean;
}

const CancelAndSubmitButton = ({
  onSubmit,
  className,
  loading = false,
}: CancelAndSubmitButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {/* 취소 버튼 */}
      <Button
        type="button"
        className="text-white cursor-pointer text-base font-normal w-28 h-10 bg-red-400 hover:bg-red-300 rounded-lg"
      >
        삭제
      </Button>
      <Button
        type="button"
        className="text-white cursor-pointer text-base font-normal w-28 h-10 bg-orange-400 hover:bg-orange-300 rounded-lg"
      >
        모집마감
      </Button>

      {/* 저장 버튼 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild disabled={loading}>
          <div className="text-white w-28 flex justify-center items-center cursor-pointer text-base font-normal h-10 bg-secondary hover:bg-secondary/90 rounded-lg">
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
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
                setIsOpen(false);
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
