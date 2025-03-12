import { faker } from "@faker-js/faker";
import ApplyCard from "../Card/ApplyCard";
import SectionLable from "../SectionLable";
import ShowMoreButton from "../ShowMoreButton";

import { fakeTeams } from "../../constants/fakeInfo/fakeTeams";
import Link from "next/link";

export default function ApplyListPreview() {
  return (
    <div className="w-full h-auto mb-16">
      <SectionLable title="모집" />
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, i) => {
          const fakeTeam = faker.helpers.arrayElement(fakeTeams);
          return (
            <Link
              className="w-full h-full"
              key={i}
              href={`/teams/${fakeTeam.id}`}
            >
              <ApplyCard
                id={fakeTeam.id}
                key={i}
                status={fakeTeam.status}
                title={fakeTeam.title}
                active={true}
                name={fakeTeam.name}
                view={fakeTeam.view}
                date={fakeTeam.date}
                description={fakeTeam.description}
              />
            </Link>
          );
        })}
      </div>
      <ShowMoreButton href="/teams" />
    </div>
  );
}
