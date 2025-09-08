"use client";

import PostForm from "@/app/posts/[id]/_components/PostForm";

const PostEditPage = ({ params }: { params: { id: string } }) => {
  return <PostForm postId={parseInt(params.id, 10)} />;
};

export default PostEditPage;
