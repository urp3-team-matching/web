import { Calendar, Eye } from "lucide-react";
import Link from "next/link";

const FakePostInfo = {
  id: 1,
  title: "Post Title 1",
  content: "This is the content of post 1",
  author: "Author 1",
  password: "1111",
  view: "100",
  date: "2023-10-01",
};
export default function PostCard() {
  return (
    <Link
      href="/post/1"
      className="w-full h-20 flex-col gap-2  flex justify-center px-5  border-y-1"
    >
      <span className="text-base font-medium">{FakePostInfo.title}</span>
      <div className="flex gap-2">
        <div className="flex items-center gap-1 text-xs font-medium">
          <Eye className="size-5" />
          {FakePostInfo.view}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium">
          <Calendar className="size-5" />
          {FakePostInfo.date}
        </div>
      </div>
    </Link>
  );
}
