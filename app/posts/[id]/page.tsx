"use client";

import FileButton from "@/app/posts/[id]/_components/FileButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import useUser from "@/hooks/use-user";
import apiClient, { PublicPost } from "@/lib/apiClientHelper";
import { parseFileNameFromUrl } from "@/lib/supabaseStorage";
import { cn, parseDate } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const PostDetail = ({
  params,
  className,
}: {
  params: { id: string };
  className?: string;
}) => {
  const user = useUser();

  const [post, setPost] = useState<PublicPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const post = await apiClient.getPostById(parseInt(params.id));
      setPost(post);
      setLoading(false);
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return <div>포스트를 찾을 수 없습니다!</div>;
  }

  return (
    <div className={cn("my-6", className)}>
      {user && (
        <div className="flex justify-end mb-2">
          <a href={`/posts/${post.id}/edit`}>
            <Button>편집</Button>
          </a>
        </div>
      )}

      {/* 메인: 프로젝트 제목 */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black w-full h-12">
        {post.title}
      </h3>

      {/* 하단: 프로젝트 조회수, 생성 일시 */}
      <div className="gap-3 flex h-7 items-center font-medium text-xs">
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{post.viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{parseDate(post.createdDatetime)}</span>
        </div>
      </div>

      <Separator className="my-4 border-gray" />

      {/* 첨부파일 */}
      {post.attachments.length > 0 && (
        <>
          <div className="flex gap-x-3">
            {post.attachments.map((attachment) => (
              <FileButton
                key={attachment}
                url={attachment}
                fileName={parseFileNameFromUrl(attachment) || ""}
              />
            ))}
          </div>
          <Separator className="my-4 border-gray" />
        </>
      )}

      {/* 중앙: 내용 */}
      <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
    </div>
  );
};

export default PostDetail;
