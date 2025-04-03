import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export function ApplyStatueMenubar() {
  return (
    <Menubar className="w-44 text-nowrap h-10">
      <MenubarMenu>
        <MenubarTrigger className="w-1/3 focus:cursor-pointer flex justify-center ">
          전체
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="w-1/3 focus:cursor-pointer flex justify-center ">
          모집중
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="w-1/3 focus:cursor-pointer flex justify-center ">
          모집마감
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
