import Link from "next/link";

import { faker } from "@faker-js/faker";
import { fakeTopics } from "../../constants/fakeInfo/fakeTopics";
import ProjectCard from "./ProjectCard";

export function ProjectList() {
  return (
    <div className="w-full h-auto">
      <div className="w-full h-auto flex  flex-col">
        {[...Array(5)].map((_, i) => {
          const fakeTopic = faker.helpers.arrayElement(fakeTopics);
          return (
            <Link key={i} href={`/projects/${fakeTopic.id}`}>
              <ProjectCard
                keywords={fakeTopic.keywords}
                id={fakeTopic.id}
                title={fakeTopic.title}
                name={fakeTopic.name}
                view={fakeTopic.view}
                date={fakeTopic.date}
                status={
                  fakeTopic.status as "recruiting" | "closingSoon" | "closed"
                }
                proposer={
                  fakeTopic.proposer as "professor" | "student" | "admin"
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
