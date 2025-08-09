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

const sidebarMenus = [
  { title: "프로젝트", url: "/" },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div
                onClick={toggleSidebar}
                className="w-full cursor-pointer h-14 flex mb-5 items-center justify-end"
              >
                <X className="size-12 stroke-1" />
              </div>
              {sidebarMenus.map((menu) => (
                <SidebarMenuItem className="h-14" key={menu.title}>
                  <Separator />
                  <SidebarMenuButton className="text-2xl" asChild>
                    <Link
                      className="flex justify-end h-full items-center gap-2"
                      href={menu.url}
                    >
                      {menu.title}
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
