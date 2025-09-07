"use client";

import Spinner from "@/components/ui/spinner";
import { File } from "lucide-react";
import { useState } from "react";

const FileButton = ({ url, fileName }: { url: string; fileName: string }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <a
      href={url}
      onClick={(e) => {
        e.preventDefault();
        if (fileName) {
          handleDownload(url, fileName);
        } else {
          alert("파일 이름을 추출할 수 없습니다.");
        }
      }}
      className="hover:underline flex items-center gap-0.5"
    >
      {downloading ? (
        <Spinner className="size-5" />
      ) : (
        <File className="size-5 inline" />
      )}
      <span>{fileName}</span>
    </a>
  );
};

export default FileButton;
