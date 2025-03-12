import Link from "next/link";
import TopicCard from "../Card/TopicCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";
import { faker } from "@faker-js/faker";
import { fakeTopics } from "../../constants/fakeInfo/fakeTopics";

export function TopicPreviewList() {
  return (
    <div className="w-[690px] h-auto">
      <SectionLable title="주제" />
      <div className="w-full h-auto flex gap-2 flex-col">
        {[...Array(4)].map((_, i) => {
          const fakeTopic = faker.helpers.arrayElement(fakeTopics);
          return (
            <Link key={i} href={`/topics/${fakeTopic.id}`}>
              <TopicCard
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
      <ShowMoreButton href="/topics" />
    </div>
  );
}
