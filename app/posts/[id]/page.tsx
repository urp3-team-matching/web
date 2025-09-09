"use client";

import FileButton from "@/app/posts/[id]/_components/FileButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import useUser from "@/hooks/use-user";
import apiClient, { PublicPost } from "@/lib/apiClientHelper";
import { NotFoundError } from "@/lib/authUtils";
import { parseDate } from "@/lib/utils";
import { Attachment } from "@/types/post";
import { Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PostDetail = ({ params }: { params: { id: string } }) => {
  const user = useUser();

  const [post, setPost] = useState<PublicPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await apiClient.getPostById(parseInt(params.id));
        setPost(post);
      } catch (error) {
        if (error instanceof NotFoundError) {
          setPost(null);
          return;
        } else {
          console.error(error);
          alert("포스트를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  const onDelete = async () => {
    if (!post) return;
    if (!confirm("정말로 이 포스트를 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      await apiClient.deletePost(post.id);
      alert("포스트가 삭제되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("포스트 삭제 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-col text-center items-center justify-center py-10 text-xl space-y-3">
        <h1>포스트를 찾을 수 없습니다!</h1>
        <Link href="/">
          <Button variant="outline">홈으로 이동</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="my-6">
      {user && (
        <div className="flex justify-end mb-2">
          <a href={`/posts/${post.id}/edit`}>
            <Button>편집</Button>
          </a>
        </div>
      )}

      {/* 헤더: 프로젝트 제목 */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-black w-full h-12">
        {post.title}
      </h3>

      {/* 헤더: 프로젝트 조회수, 생성 일시 */}
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
      {post.attachments && Object.keys(post.attachments).length > 0 && (
        <>
          <div className="flex-col sm:flex gap-x-3">
            {Object.values(post.attachments).map((attachment: Attachment) => (
              <FileButton
                key={attachment.url}
                url={attachment.url}
                fileName={attachment.name}
              />
            ))}
          </div>
          <Separator className="my-4 border-gray" />
        </>
      )}

      {/* 중앙: 내용 */}
      <div className="mt-6 whitespace-pre-wrap">{post.content}</div>
      <Separator className="my-4 border-gray" />

      {/* 하단: 목록 */}
      <div className="flex justify-end gap-x-2">
        {user && (
          <Button variant="destructive" onClick={onDelete}>
            삭제
          </Button>
        )}
        <Link href="/">
          <Button variant="outline">목록</Button>
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
