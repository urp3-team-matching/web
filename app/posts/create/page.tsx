"use client";

import PostForm from "@/app/posts/[id]/_components/PostForm";

const PostEditPage = () => {
  return (
    <div>
      <div className="py-3 border-b-1">
        <h1 className="text-3xl">공지사항 생성</h1>
      </div>

      <PostForm />
    </div>
  );
};

export default PostEditPage;
