import Link from "next/link";

import { faker } from "@faker-js/faker";
import { fakeTopics } from "../constants/fakeInfo/fakeTopics";
import ProjectCard from "./ProjectCard";

export function ProjectList() {
  return (
    <div className="w-[690px] h-auto">
      <div className="w-full h-auto flex gap-2 flex-col">
        {[...Array(4)].map((_, i) => {
          const fakeTopic = faker.helpers.arrayElement(fakeTopics);
          return (
            <Link key={i} href={`/topics/${fakeTopic.id}`}>
              <ProjectCard
                id={fakeTopic.id}
                title={fakeTopic.title}
                name={fakeTopic.name}
                view={fakeTopic.view}
                date={fakeTopic.date}
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
