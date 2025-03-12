import { faker } from "@faker-js/faker";
import HotTopicCard from "../Card/HotTopicCard";
import SectionLable from "../SectionLable";
import { fakeTopics } from "../../constants/fakeInfo/fakeTopics";
import Link from "next/link";

export function HotTopicPreviewList() {
  return (
    <div className="w-[487px] h-auto">
      <SectionLable title="인기" />
      <div className="w-full gap-2 h-auto grid-cols-2 grid-rows-2 grid">
        {[...Array(4)].map((_, i) => {
          const fakeTopic = faker.helpers.arrayElement(fakeTopics);
          return (
            <Link key={i} href={`/topics/${fakeTopic.id}`}>
              <HotTopicCard
                id={fakeTopic.id}
                key={i}
                title={fakeTopic.title}
                name={fakeTopic.name}
                view={fakeTopic.view}
                date={fakeTopic.date}
                proposer={
                  fakeTopic.proposer as "professor" | "student" | "admin"
                }
              ></HotTopicCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
