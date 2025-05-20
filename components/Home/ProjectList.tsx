import Link from "next/link";

import CustomPagination from "@/components/Pagination";
import ApiClient from "@/lib/apiClientHelper";
import ProjectCard from "./ProjectCard";

export async function ProjectList() {
  const res = await ApiClient.getProjects();

  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto flex  flex-col">
        {res.data.map((project, i) => (
          <Link key={i} href={`/projects/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>

      <CustomPagination totalPages={res.totalPages} />
    </div>
  );
}
