"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

const items = [
  { title: "프로젝트", url: "/" },
  { title: "공지사항", url: "/notice" },
];

export function AppSidebar() {
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false); // 혹은 toggleSidebar();
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="w-full h-14 flex mb-5 items-center justify-end">
                <button className="cursor-pointer" onClick={handleClose}>
                  <X className="size-12 stroke-1" />
                </button>
              </div>
              {items.map((item) => (
                <SidebarMenuItem className="h-14" key={item.title}>
                  <Separator></Separator>
                  <SidebarMenuButton asChild>
                    <Link
                      className="flex justify-end h-full  items-center gap-2"
                      href={item.url}
                    >
                      <span className="text-2xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator></Separator>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
