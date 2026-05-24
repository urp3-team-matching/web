"use client";
import { use } from "react";

import PostForm from "@/app/posts/[id]/_components/PostForm";

const PostEditPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  return (
    <div>
      <div className="py-3 border-b-1">
        <h1 className="text-3xl">공지사항 수정</h1>
      </div>

      <PostForm postId={parseInt(params.id, 10)} />
    </div>
  );
};

export default PostEditPage;
