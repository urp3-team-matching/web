import { Calendar, Eye } from "lucide-react";

export default function PostPage() {
  return (
    <div className="pageWidth w-full flex justify-center h-auto">
      <div className=" pt-12">
        <div className="h-16 text-4xl font-medium pb-2 flex flex-col justify-end border-b-[1px] border-black">
          팀 빌딩 시 주의사항
        </div>
        <div>
          <span>김훈모</span>
          <div>
            <Eye />
            <span>1234</span>
          </div>
          <div>
            <Calendar />
            <span> 2025-02-06 </span>
          </div>
        </div>
      </div>
    </div>
  );
}
