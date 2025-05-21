import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import Link from "next/link";

const items = [
  { title: "프로젝트", url: "/" },
  { title: "공지사항", url: "/notice" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="w-full h-14 flex mb-5 items-center justify-end">
                <X className="size-12 stroke-1" />
              </div>
              {items.map((item) => (
                <SidebarMenuItem className="h-14" key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="flex justify-end h-full items-center gap-2"
                      href={item.url}
                    >
                      <span className="text-2xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
