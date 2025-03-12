import { faker } from "@faker-js/faker";
import HotTopicCard from "../Card/HotTopicCard";
import SectionLable from "../SectionLable";
import {
  fakeNameArray,
  fakeProposerArray,
  fakeTitleArray,
} from "../fakeInfo/fakeInfo";

export function HotTopicPreviewList() {
  return (
    <div className="w-[487px] h-auto">
      <SectionLable title="인기" />
      <div className="w-full gap-2 h-auto grid-cols-2 grid-rows-2 grid">
        {[...Array(4)].map((_, i) => {
          const fakeTitle = faker.helpers.arrayElement(fakeTitleArray);
          const fakeName = faker.helpers.arrayElement(fakeNameArray);
          const fakeDate = faker.date.anytime();
          const fakeView = faker.number.int(100);
          const fakeProposer = faker.helpers.arrayElement(fakeProposerArray);
          return (
            <HotTopicCard
              key={i}
              title={fakeTitle}
              name={fakeName}
              view={fakeView}
              date={fakeDate}
              proposer={fakeProposer as "professor" | "student" | "admin"}
            ></HotTopicCard>
          );
        })}
      </div>
    </div>
  );
}
