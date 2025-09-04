import { PublicPost } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";

export interface PostCardProps {
  post: PublicPost;
  className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
  return (
    <div
      className={cn(
        "w-full border-t-[1px] py-2.5 px-1 sm:px-2 md:px-3 lg:px-4 bg-white hover:bg-slate-50 transition-colors duration-200 ease-in-out",
        className
      )}
    >
      <div className="flex flex-col sm:gap-2 gap-1 justify-between h-full">
        {/* 제목 */}
        <div className="sm:text-base text-[14px] sm:pr-0 pr-5 font-medium sm:pl-1 py-[1px] flex items-center gap-2">
          <Megaphone /> <span>{post.title}</span>
        </div>

        {/* TODO: 요청시 재활성화 */}
        {/* 하단: 작성자, 조회수, 생성일, 키워드 */}
        {/* <div className="sm:gap-3 gap-1 flex sm:flex-row flex-col font-medium sm:text-sm text-xs">
          <div className="flex text-slate-500 *:items-center gap-[6px] sm:gap-3">
            <span className="flex ">{post.author}</span>
            <div className="flex gap-1">
              <Eye className="sm:size-5 size-[14px] mt-0.5" />
              <span>{post.viewCount}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="sm:size-5 size-[14px] mt-0.5" />
              <span>{parseDate(post.createdDatetime)}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
