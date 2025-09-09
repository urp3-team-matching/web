import FileDropzone from "@/app/posts/[id]/_components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/apiClientHelper";
import { getPublicUrl, uploadFile } from "@/lib/supabaseStorage";
import { Attachment, PostInput, PostSchema } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const PostForm = ({ postId }: { postId?: number }) => {
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  const { handleSubmit, control, getValues, setValue, register, formState } =
    useForm<PostInput>({
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
      const attachments: Attachment[] =
        (post.attachments as Attachment[]) || [];
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("attachments", attachments);
      setLoading(false);
    };
    fetchPost();
  }, [postId, setValue]);

  const onSuccess = async (data: PostInput) => {
    setLoading(true);
    try {
      let attachments: { url: string; name: string }[] = [];

      // 수정일 때 기존 첨부파일 유지
      if (postId) {
        if (selectedFiles.length > 0) {
          // 새 파일 업로드
          for (const file of selectedFiles) {
            const ext = file.name.split(".").pop();
            const uuidFileName = `${uuidv4()}.${ext}`;
            const path = `posts/${uuidFileName}`;
            const { data: uploadData, error } = await uploadFile(file, path);
            if (!error && uploadData) {
              const url = getPublicUrl(uploadData.path);
              attachments.push({ url, name: file.name });
            }
          }
        } else {
          // 첨부파일 수정 없으면 기존 값 유지
          attachments = control._formValues.attachments ?? [];
        }
        const postData = { ...data, attachments };
        await apiClient.updatePost(postId, postData);
        router.push(`/posts/${postId}`);
      } else {
        // 새 글 작성 시
        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            const ext = file.name.split(".").pop();
            const uuidFileName = `${uuidv4()}.${ext}`;
            const path = `posts/${uuidFileName}`;
            const { data: uploadData, error } = await uploadFile(file, path);
            if (!error && uploadData) {
              const url = getPublicUrl(uploadData.path);
              attachments.push({ url, name: file.name });
            }
          }
        }
        const postData = { ...data, attachments };
        const created = await apiClient.createPost(postData);
        router.push(`/posts/${created.id}`);
      }
      setSelectedFiles([]);
    } catch {
      alert("포스트 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full my-3">
      <form onSubmit={handleSubmit(onSuccess)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input {...register("title")} placeholder="제목" />
          {formState.errors.title && (
            <p className="text-red-500">{formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments">첨부파일</Label>
          <FileDropzone
            onFilesAdded={(files) => setSelectedFiles(files)}
            initialFiles={getValues("attachments")}
          />
          {formState.errors.attachments && (
            <p className="text-red-500">
              {formState.errors.attachments.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">본문</Label>
          <Textarea {...register("content")} placeholder="본문" />
          {formState.errors.content && (
            <p className="text-red-500">{formState.errors.content.message}</p>
          )}
        </div>

        <Button type="submit">제출</Button>
      </form>
    </div>
  );
};

export default PostForm;
