import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/apiClientHelper";
import { cn, parseDate } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";

const PostDetail = async ({
  params,
  className,
}: {
  params: { id: string };
  className?: string;
}) => {
  const post = await apiClient.getPostById(parseInt(params.id));

  return (
    <div className={cn("my-6", className)}>
      {/* 메인: 프로젝트 제목 */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black w-full h-12">
        {post.title}
      </h3>

      {/* 하단: 프로젝트 조회수, 생성 일시 */}
      <div className="gap-3 flex h-7 items-center font-medium text-xs">
        <div>{post.author}</div>
        <Separator orientation="vertical" className="border-gray" />
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{post.viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{parseDate(post.createdDatetime)}</span>
        </div>
      </div>

      {/* 중앙: 내용 */}
      <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
    </div>
  );
};

export default PostDetail;
