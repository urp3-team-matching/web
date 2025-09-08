import { supabase } from "@/lib/supabaseClient";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface UseFileProps {
  bucketName?: string;
}

interface UseFileResult {
  uploadFile: (file: File, folder?: string) => Promise<string | null>;
  downloadFile: (path: string) => Promise<Blob | null>;
  deleteFile: (path: string) => Promise<boolean>;
  getFileUrl: (path: string) => Promise<string | null>;
  isLoading: boolean;
  isError: Error | null;
  clearError: () => void;
}

/**
 * Supabase Storage와의 파일 CRUD 작업을 처리하는 커스텀 훅
 * @param bucketName 사용할 Storage 버킷 이름 (기본값: web-{NODE_ENV})
 */
export function useFile({
  bucketName = `web-${process.env.NODE_ENV || "development"}`,
}: UseFileProps = {}): UseFileResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<Error | null>(null);

  /**
   * 에러 상태 초기화
   */
  const clearError = useCallback(() => {
    setIsError(null);
  }, []);

  /**
   * 파일을 Supabase Storage에 업로드
   * @param file 업로드할 파일
   * @param folder 저장 폴더 경로 (선택사항)
   * @returns 업로드된 파일의 경로 또는 null
   */
  const uploadFile = useCallback(
    async (file: File, folder?: string): Promise<string | null> => {
      if (!file) {
        setIsError(new Error("No file provided for upload"));
        return null;
      }

      setIsLoading(true);
      setIsError(null);

      try {
        // 파일명 충돌 방지를 위한 고유 이름 생성
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // 파일 업로드
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        return filePath;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Upload failed");
        console.error("File upload error:", err);
        setIsError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [bucketName]
  );

  /**
   * Supabase Storage에서 파일 다운로드
   * @param path 다운로드할 파일 경로
   * @returns 파일 Blob 또는 null
   */
  const downloadFile = useCallback(
    async (path: string): Promise<Blob | null> => {
      setIsLoading(true);
      setIsError(null);

      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(path);

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Download failed");
        console.error("File download error:", err);
        setIsError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [bucketName]
  );

  /**
   * 파일 URL 가져오기
   * @param path 파일 경로
   * @returns 파일의 공개 URL 또는 null
   */
  const getFileUrl = useCallback(
    async (path: string): Promise<string | null> => {
      try {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

        return data.publicUrl;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to get file URL");
        console.error("Get file URL error:", err);
        setIsError(err);
        return null;
      }
    },
    [bucketName]
  );

  /**
   * Supabase Storage에서 파일 삭제
   * @param path 삭제할 파일 경로
   * @returns 삭제 성공 여부
   */
  const deleteFile = useCallback(
    async (path: string): Promise<boolean> => {
      setIsLoading(true);
      setIsError(null);

      try {
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([path]);

        if (error) {
          throw error;
        }

        return true;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Deletion failed");
        console.error("File deletion error:", err);
        setIsError(err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [bucketName]
  );

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    getFileUrl,
    isLoading,
    isError,
    clearError,
  };
}
