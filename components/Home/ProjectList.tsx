"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import PostCard from "@/components/Home/PostCard";
import CustomPagination from "@/components/Pagination";
import Spinner from "@/components/ui/spinner";
import ApiClient, {
  PublicPost,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { GetProjectsQuerySchema } from "@/types/project";
import ProjectCard from "./ProjectCard";

function safeParseSearchParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  try {
    return schema.parse(queryParams);
  } catch {
    console.warn("Invalid query parameters, using defaults");
    return {
      sortBy: "createdDatetime",
      sortOrder: "desc",
    };
  }
}

const ProjectList = () => {
  const searchParams = useSearchParams();

  const [notices, setNotices] = useState<PublicPost[]>();
  const [noticeLoading, setNoticeLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<PublicProjectWithForeignKeys[]>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [projectLoading, setProjectLoading] = useState<boolean>(true);

  // 공지사항 불러오기
  useEffect(() => {
    (async () => {
      setNoticeLoading(true);
      try {
        const res = await ApiClient.getPosts();
        setNotices(res.data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setNoticeLoading(false);
      }
    })();
  }, []);

  // 프로젝트 불러오기
  useEffect(() => {
    (async () => {
      setProjectLoading(true);
      try {
        const queryParams = safeParseSearchParams(
          searchParams,
          GetProjectsQuerySchema
        );

        const res = await ApiClient.getProjects(queryParams);
        setProjects(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setProjectLoading(false);
      }
    })();
  }, [searchParams]);

  return (
    <div className="w-full space-y-3 pb-3">
      <div className="w-full flex flex-col border-y border-y-black">
        {/* 공지사항 */}
        <div className="border-b border-b-black">
          {noticeLoading ? (
            <div className="w-full flex justify-center items-center py-5">
              <Spinner />
            </div>
          ) : (
            notices &&
            notices.length > 0 &&
            notices.map((notice) => (
              <Link key={notice.id} href={`/posts/${notice.id}`}>
                <PostCard post={notice} />
              </Link>
            ))
          )}
        </div>

        {/* 프로젝트 */}
        <div>
          {projectLoading ? (
            <div className="w-full flex justify-center items-center py-10">
              <Spinner />
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="w-full flex justify-center items-center py-5">
              <span className="text-lg font-semibold">
                등록된 프로젝트가 없습니다.
              </span>
            </div>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <ProjectCard project={project} />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <CustomPagination totalPages={totalPages} />
    </div>
  );
};

export default ProjectList;
