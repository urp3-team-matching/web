import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { ProjectPageMode } from "../../page";

interface KeywordMenubarProps {
  mode: ProjectPageMode;
  project: PublicProjectWithForeignKeys;
}

export default function KeywordMenubar({ mode, project }: KeywordMenubarProps) {
  return (
    <Menubar className="lg:hidden h-full p-0 border-none bg-none shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="w-full p-0 h-6 sm:h-7 border-none">
          <Badge className="sm:w-[72px] bg-gray-200 text-black w-14 h-6 text-[11px] p-0 sm:h-7 font-medium sm:text-sm rounded-sm">
            키워드
            <ChevronDown size={16} />
          </Badge>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            {mode === null && (
              <div className="w-auto h-full flex gap-1 items-center">
                {project.keywords.map((keyword) => (
                  <KeywordBadge key={keyword} keyword={keyword} />
                ))}
              </div>
            )}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
