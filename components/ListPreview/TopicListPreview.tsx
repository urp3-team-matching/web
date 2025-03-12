import Link from "next/link";
import TopicCard from "../Card/TopicCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";
import { faker } from "@faker-js/faker";
import {
  fakeNameArray,
  fakeProposerArray,
  fakeTitleArray,
} from "../fakeInfo/fakeInfo";

export function TopicPreviewList() {
  return (
    <div className="w-[690px] h-auto">
      <SectionLable title="주제" />
      <div className="w-full h-auto flex gap-2 flex-col">
        {[...Array(4)].map((_, i) => {
          const fakeTitle = faker.helpers.arrayElement(fakeTitleArray);
          const fakeName = faker.helpers.arrayElement(fakeNameArray);
          const fakeDate = faker.date.anytime();
          const fakeView = faker.number.int(100);
          const fakeProposer = faker.helpers.arrayElement(fakeProposerArray);
          return (
            <Link key={i} href={`/topics/${i + 1}`}>
              <TopicCard
                key={i}
                title={fakeTitle}
                name={fakeName}
                view={fakeView}
                date={fakeDate}
                proposer={fakeProposer as "professor" | "student" | "admin"}
              />
            </Link>
          );
        })}
      </div>
      <ShowMoreButton href="/topics" />
    </div>
  );
}
