"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import CustomPagination from "@/components/Pagination";
import Spinner from "@/components/ui/spinner";
import ApiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
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

  const [projects, setProjects] = useState<PublicProjectWithForeignKeys[]>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
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
        setLoading(false);
      }
    })();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full flex justify-center items-center">
        <span className="text-lg font-semibold">
          등록된 프로젝트가 없습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 pb-3">
      {/* 프로젝트 목록 */}
      <div className="w-full flex flex-col">
        {projects.map((project, i) => (
          <Link key={i} href={`/projects/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <CustomPagination totalPages={totalPages} />
    </div>
  );
};

export default ProjectList;
