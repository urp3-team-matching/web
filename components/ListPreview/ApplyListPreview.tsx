import { faker } from "@faker-js/faker";
import ApplyCard from "../Card/ApplyCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";
import {
  fakeApplyTitleArray,
  fakeDescriptionArray,
  fakeNameArray,
  fakeStatusArray,
} from "../fakeInfo/fakeInfo";

export default function ApplyListPreview() {
  return (
    <div className="w-full h-auto">
      <SectionLable title="모집" />
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => {
          const fakeTitle = faker.helpers.arrayElement(fakeApplyTitleArray);
          const fakeName = faker.helpers.arrayElement(fakeNameArray);
          const fakeStatus = faker.helpers.arrayElement(fakeStatusArray);
          const fakeDescription =
            faker.helpers.arrayElement(fakeDescriptionArray);
          return (
            <ApplyCard
              key={i}
              status={fakeStatus as "recruiting" | "closed" | "closingSoon"}
              title={fakeTitle}
              active={true}
              name={fakeName}
              view={110202}
              date={new Date("2025-03-06")}
              description={fakeDescription}
            />
          );
        })}
      </div>
      <ShowMoreButton href="/teams" />
    </div>
  );
}
