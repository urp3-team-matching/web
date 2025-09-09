"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

import { useState } from "react";

interface FileDropzoneProps {
  onFilesAdded?: (files: File[]) => void;
  initialFiles?: { url: string; name: string }[];
}

const FileDropzone = ({ onFilesAdded, initialFiles }: FileDropzoneProps) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    setFiles(files);
    onFilesAdded?.(files);
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      onError={console.error}
      src={files}
      maxFiles={10}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
      {/* 기존 파일 목록 표시 */}
      {!files && initialFiles && initialFiles.length > 0 && (
        <ul className="mt-2">
          {initialFiles.map((file) => (
            <li key={file.url} className="flex items-center">
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>

              {/* TODO: 제거 기능 구현 */}
              {/* <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const updatedFiles = initialFiles.filter(
                    (f) => f.url !== file.url
                  );
                  // onFilesRemoved?.(updatedFiles);
                }}
                className="ml-2"
              >
                <X className="inline h-4 w-4 cursor-pointer text-red-500" />
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </Dropzone>
  );
};

export default FileDropzone;
