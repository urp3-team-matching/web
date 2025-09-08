import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/apiClientHelper";
import { PostInput, PostSchema } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const PostForm = ({ postId }: { postId?: number }) => {
  const [loading, setLoading] = useState(true);

  const { handleSubmit, control, setValue } = useForm<PostInput>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      attachments: [],
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }
      const post = await apiClient.getPostById(postId);
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("attachments", post.attachments || []);
      setLoading(false);
    };
    fetchPost();
  }, [postId, setValue]);

  const onSuccess = async (data: PostInput) => {
    setLoading(true);
    try {
      if (postId) {
        await apiClient.updatePost(postId, data);
        alert("포스트가 성공적으로 수정되었습니다.");
      } else {
        await apiClient.createPost(data);
        alert("포스트가 성공적으로 생성되었습니다.");
      }
    } catch {
      alert("포스트 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalidSubmit = () => {
    console.error(control._formState.errors);
    alert("포스트 저장에 실패했습니다. 입력값을 확인해주세요.");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full my-3">
      <form
        onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input {...control.register("title")} placeholder="제목" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments">첨부파일</Label>
          <Textarea
            {...control.register("attachments")}
            placeholder="첨부파일"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">본문</Label>
          <Textarea {...control.register("content")} placeholder="본문" />
        </div>

        <Button type="submit">제출</Button>
      </form>
    </div>
  );
};

export default PostForm;
