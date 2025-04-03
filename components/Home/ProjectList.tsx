import Link from "next/link";

import { faker } from "@faker-js/faker";
import { fakeProjects } from "../../constants/fakeProject";
import ProjectCard from "./ProjectCard";

export function ProjectList() {
  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto flex  flex-col">
        {[...Array(5)].map((_, i) => {
          const fakeProject = faker.helpers.arrayElement(fakeProjects);
          return (
            <Link key={i} href={`/projects/${fakeProject.id}`}>
              <ProjectCard
                keywords={fakeProject.keywords}
                id={fakeProject.id}
                title={fakeProject.title}
                name={fakeProject.name}
                view={fakeProject.view}
                date={fakeProject.date}
                status={
                  fakeProject.status as "recruiting" | "closingSoon" | "closed"
                }
                proposer={
                  fakeProject.proposer as "professor" | "student" | "admin"
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
