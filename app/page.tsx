import ApplyListPreview from "@/components/List/ApplyListPreview";
import { HotTopicPreviewList } from "@/components/List/HotTopicListPreview";
import { TopicPreviewList } from "@/components/List/TopicListPreview";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div className="min-[1200px]:w-[1200px] flex-col flex w-full h-auto ">
      <div className="w-full flex mb-16 justify-between">
        <HotTopicPreviewList />
        <TopicPreviewList />
      </div>
      <ApplyListPreview />
    </div>
  );
}
